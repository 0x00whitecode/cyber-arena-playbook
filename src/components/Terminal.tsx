import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Terminal as TerminalIcon, Play, Square } from 'lucide-react';

interface TerminalProps {
  labId?: number;
  onCommand?: (command: string) => void;
}

interface TerminalLine {
  type: 'input' | 'output' | 'system';
  text: string;
  timestamp: Date;
}

const NESSUS_COMMANDS = {
  help: `Available Nessus commands:
  nessus --help           Show this help
  nessus --version        Show Nessus version
  nessus --scan-new       Create new scan
  nessus --scan-list      List existing scans
  nessus --scan-run <id>  Run scan by ID
  nessus --results <id>   Show scan results
  clear                   Clear terminal`,
  
  version: 'Nessus Professional 10.4.2 (Simulation Mode)',
  
  'scan-new': `Creating new vulnerability scan...
Scan Template: Basic Network Scan
Target: 192.168.1.0/24
Scan created with ID: scan_001
Use 'nessus --scan-run scan_001' to start`,

  'scan-list': `Active Scans:
  scan_001  Basic Network Scan     Created    192.168.1.0/24
  scan_002  Web Application Scan   Running    10.0.1.100
  scan_003  Internal Network       Complete   172.16.0.0/16`,

  'scan-run': (id: string) => `Starting scan ${id}...
[████████████████████████████████████████] 100%
Scan completed in 47 seconds
Found 12 vulnerabilities (3 High, 5 Medium, 4 Low)
Use 'nessus --results ${id}' to view details`,

  'results': (id: string) => `Scan Results for ${id}:

HIGH SEVERITY:
  CVE-2021-44228  Log4j RCE           Port 8080/tcp
  CVE-2021-34527  PrintNightmare      Port 445/tcp  
  CVE-2020-1472   Zerologon          Port 445/tcp

MEDIUM SEVERITY:
  CVE-2019-0708   BlueKeep           Port 3389/tcp
  CVE-2017-0144   EternalBlue        Port 445/tcp
  SSL Certificate Issues              Port 443/tcp
  Weak SSH Configuration             Port 22/tcp
  Information Disclosure             Port 80/tcp

LOW SEVERITY:
  Banner Grabbing                    Multiple ports
  Open Port Discovery               Multiple ports
  Service Version Detection         Multiple ports
  DNS Information Disclosure        Port 53/tcp`
};

export const Terminal: React.FC<TerminalProps> = ({ labId, onCommand }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', text: 'Nessus Professional Terminal - Simulation Mode', timestamp: new Date() },
    { type: 'system', text: 'Type "help" for available commands', timestamp: new Date() },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines(prev => [...prev, { type, text, timestamp: new Date() }]);
  };

  const processCommand = (command: string) => {
    addLine('input', `$ ${command}`);
    
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setLines([
        { type: 'system', text: 'Nessus Professional Terminal - Simulation Mode', timestamp: new Date() },
        { type: 'system', text: 'Type "help" for available commands', timestamp: new Date() },
      ]);
      return;
    }

    if (cmd === 'nessus --help' || cmd === 'help') {
      addLine('output', NESSUS_COMMANDS.help);
    } else if (cmd === 'nessus --version') {
      addLine('output', NESSUS_COMMANDS.version);
    } else if (cmd === 'nessus --scan-new') {
      setIsRunning(true);
      setTimeout(() => {
        addLine('output', NESSUS_COMMANDS['scan-new']);
        setIsRunning(false);
      }, 2000);
    } else if (cmd === 'nessus --scan-list') {
      addLine('output', NESSUS_COMMANDS['scan-list']);
    } else if (cmd.startsWith('nessus --scan-run')) {
      const scanId = cmd.split(' ')[2] || 'scan_001';
      setIsRunning(true);
      setTimeout(() => {
        addLine('output', NESSUS_COMMANDS['scan-run'](scanId));
        setIsRunning(false);
      }, 3000);
    } else if (cmd.startsWith('nessus --results')) {
      const scanId = cmd.split(' ')[2] || 'scan_001';
      addLine('output', NESSUS_COMMANDS['results'](scanId));
    } else if (cmd.trim() === '') {
      // Empty command, do nothing
    } else {
      addLine('output', `Command not found: ${command}. Type "help" for available commands.`);
    }

    onCommand?.(command);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRunning) {
      processCommand(currentInput);
      setCurrentInput('');
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  return (
    <Card className="bg-gradient-secondary border-border shadow-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TerminalIcon className="h-5 w-5 text-primary" />
          Nessus Terminal Simulator
          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-cyber-orange">
              <div className="h-2 w-2 bg-cyber-orange rounded-full animate-pulse" />
              Running...
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={terminalRef}
          className="bg-terminal-bg border border-terminal-border rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm"
        >
          {lines.map((line, index) => (
            <div key={index} className="mb-1">
              <span className="text-terminal-timestamp text-xs mr-2">
                {formatTimestamp(line.timestamp)}
              </span>
              <span className={`
                ${line.type === 'input' ? 'text-terminal-input' : ''}
                ${line.type === 'output' ? 'text-terminal-output' : ''}
                ${line.type === 'system' ? 'text-terminal-system' : ''}
              `}>
                {line.text}
              </span>
            </div>
          ))}
          
          {!isRunning && (
            <div className="flex items-center">
              <span className="text-terminal-timestamp text-xs mr-2">
                {formatTimestamp(new Date())}
              </span>
              <span className="text-terminal-prompt mr-1">$</span>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-transparent border-none outline-none flex-1 text-terminal-input"
                placeholder="Enter Nessus command..."
                autoFocus
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            size="sm" 
            onClick={() => processCommand('nessus --scan-new')}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            Quick Scan
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => processCommand('clear')}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};