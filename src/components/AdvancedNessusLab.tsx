import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Network, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Activity,
  Zap,
  Settings,
  FileText,
  Download
} from 'lucide-react';

interface VulnerabilityItem {
  id: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  cvss: number;
  host: string;
  port: string;
  description: string;
  solution: string;
}

interface ScanResult {
  scanId: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  vulnerabilities: VulnerabilityItem[];
  scanTime: number;
  hostsScanned: number;
}

export const AdvancedNessusLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const mockVulnerabilities: VulnerabilityItem[] = [
    {
      id: 'CVE-2021-44228',
      name: 'Apache Log4j Remote Code Execution',
      severity: 'Critical',
      cvss: 10.0,
      host: '192.168.1.100',
      port: '8080/tcp',
      description: 'Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints.',
      solution: 'Update to Log4j 2.16.0 or later. Alternatively, remove JndiLookup class from classpath.'
    },
    {
      id: 'CVE-2021-34527',
      name: 'Windows Print Spooler Remote Code Execution',
      severity: 'Critical',
      cvss: 8.8,
      host: '192.168.1.50',
      port: '445/tcp',
      description: 'Windows Print Spooler service improperly performs privileged file operations, allowing attackers to execute arbitrary code with SYSTEM privileges.',
      solution: 'Install the latest Windows security updates or disable the Print Spooler service if not needed.'
    },
    {
      id: 'CVE-2020-1472',
      name: 'Netlogon Elevation of Privilege Vulnerability',
      severity: 'Critical',
      cvss: 10.0,
      host: '192.168.1.10',
      port: '445/tcp',
      description: 'An elevation of privilege vulnerability exists when an attacker establishes a vulnerable Netlogon secure channel connection to a domain controller.',
      solution: 'Apply the August 2020 security updates and configure domain controllers to reject vulnerable connections.'
    },
    {
      id: 'CVE-2019-0708',
      name: 'Remote Desktop Services Remote Code Execution',
      severity: 'High',
      cvss: 9.8,
      host: '192.168.1.75',
      port: '3389/tcp',
      description: 'A remote code execution vulnerability exists in Remote Desktop Services when an unauthenticated attacker connects to the target system using RDP.',
      solution: 'Install the May 2019 security updates or disable Remote Desktop Services if not needed.'
    },
    {
      id: 'CVE-2017-0144',
      name: 'Microsoft SMBv1 Remote Code Execution',
      severity: 'High',
      cvss: 8.1,
      host: '192.168.1.25',
      port: '445/tcp',
      description: 'The SMBv1 server in Microsoft Windows allows remote attackers to execute arbitrary code via crafted packets.',
      solution: 'Disable SMBv1, apply MS17-010 security update, or block SMB ports at the network perimeter.'
    }
  ];

  const startAdvancedScan = () => {
    setIsScanning(true);
    const newScan: ScanResult = {
      scanId: `scan_${Date.now()}`,
      status: 'running',
      progress: 0,
      vulnerabilities: [],
      scanTime: 0,
      hostsScanned: 0
    };
    
    setCurrentScan(newScan);

    // Simulate scan progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const completedScan: ScanResult = {
          ...newScan,
          status: 'completed',
          progress: 100,
          vulnerabilities: mockVulnerabilities,
          scanTime: 127,
          hostsScanned: 25
        };
        
        setCurrentScan(completedScan);
        setScanHistory(prev => [completedScan, ...prev]);
        setIsScanning(false);
      } else {
        setCurrentScan(prev => prev ? {
          ...prev,
          progress,
          hostsScanned: Math.floor((progress / 100) * 25),
          scanTime: Math.floor((progress / 100) * 127)
        } : null);
      }
    }, 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const vulnerabilityCounts = currentScan?.vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.severity] = (acc[vuln.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Advanced Nessus Vulnerability Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <Network className="h-8 w-8 text-cyber-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentScan?.hostsScanned || 0}
              </div>
              <div className="text-sm text-muted-foreground">Hosts Scanned</div>
            </Card>
            
            <Card className="p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-cyber-orange mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentScan?.vulnerabilities.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Vulnerabilities</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Activity className="h-8 w-8 text-cyber-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {currentScan?.scanTime || 0}s
              </div>
              <div className="text-sm text-muted-foreground">Scan Time</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {Math.round(currentScan?.progress || 0)}%
              </div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={startAdvancedScan} 
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isScanning ? 'Scanning...' : 'Start Advanced Scan'}
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure Scan
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>

          {currentScan && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Scan Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(currentScan.progress)}%
                </span>
              </div>
              <Progress value={currentScan.progress} className="mb-2" />
              <div className="text-xs text-muted-foreground">
                Scanning network: 192.168.1.0/24 | Scan ID: {currentScan.scanId}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Vulnerability Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(vulnerabilityCounts).map(([severity, count]) => (
                    <div key={severity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(severity)}>
                          {severity}
                        </Badge>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-secondary border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Network Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Target Network</span>
                    <span className="font-medium">192.168.1.0/24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Live Hosts</span>
                    <span className="font-medium">25/254</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Open Ports</span>
                    <span className="font-medium">147</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Services Detected</span>
                    <span className="font-medium">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card className="bg-gradient-secondary border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-cyber-orange" />
                Detected Vulnerabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentScan?.vulnerabilities.map((vuln, index) => (
                  <Card key={index} className="p-4 border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{vuln.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                          <Badge variant="outline">CVSS: {vuln.cvss}</Badge>
                          <Badge variant="secondary">{vuln.host}:{vuln.port}</Badge>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{vuln.description}</p>
                    <div className="bg-background/50 p-3 rounded-md">
                      <h4 className="font-medium text-sm mb-1">Recommended Solution:</h4>
                      <p className="text-sm text-muted-foreground">{vuln.solution}</p>
                    </div>
                  </Card>
                ))}
                
                {!currentScan?.vulnerabilities.length && (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Run a scan to see vulnerabilities</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-gradient-secondary border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Generate Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Executive Summary
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Technical Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Compliance Report
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  Remediation Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gradient-secondary border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Scan History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanHistory.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div>
                      <div className="font-medium">Scan {scan.scanId}</div>
                      <div className="text-sm text-muted-foreground">
                        {scan.vulnerabilities.length} vulnerabilities found
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{scan.status}</Badge>
                      <CheckCircle className="h-4 w-4 text-cyber-green" />
                    </div>
                  </div>
                ))}
                
                {scanHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No scan history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};