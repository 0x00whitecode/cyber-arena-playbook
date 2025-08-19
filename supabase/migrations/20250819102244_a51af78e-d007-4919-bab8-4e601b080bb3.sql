-- Fix security issues by setting search_path on functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Insert sample learning paths
INSERT INTO public.learning_paths (title, description, category, difficulty, duration_minutes, objectives, prerequisites, modules) VALUES
('Healthcare Cybersecurity Fundamentals', 'Learn essential cybersecurity principles for healthcare environments including HIPAA compliance and medical device security.', 'Healthcare', 'Beginner', 180, 
 ARRAY['Understand HIPAA regulations', 'Identify healthcare-specific threats', 'Implement basic security controls', 'Secure medical devices'], 
 ARRAY['Basic IT knowledge'], 
 '{"modules": [{"title": "HIPAA Overview", "duration": 30}, {"title": "Medical Device Security", "duration": 45}, {"title": "Risk Assessment", "duration": 60}, {"title": "Incident Response", "duration": 45}]}'::jsonb),
 
('Industrial Control Systems Security', 'Comprehensive training on securing OT/ICS environments including SCADA systems and industrial protocols.', 'Industrial', 'Advanced', 240,
 ARRAY['Understand OT/IT convergence risks', 'Identify ICS vulnerabilities', 'Implement network segmentation', 'Monitor industrial protocols'],
 ARRAY['Network fundamentals', 'Basic cybersecurity knowledge'],
 '{"modules": [{"title": "ICS Architecture", "duration": 60}, {"title": "Protocol Security", "duration": 90}, {"title": "Network Segmentation", "duration": 90}]}'::jsonb),
 
('Financial Services Security', 'Learn cybersecurity requirements and best practices for financial institutions including PCI DSS compliance.', 'Financial', 'Intermediate', 200,
 ARRAY['Understand PCI DSS requirements', 'Implement financial security controls', 'Manage fraud detection', 'Ensure compliance reporting'],
 ARRAY['Basic security knowledge'],
 '{"modules": [{"title": "PCI DSS Overview", "duration": 50}, {"title": "Fraud Prevention", "duration": 75}, {"title": "Compliance Management", "duration": 75}]}'::jsonb),
 
('Core Cybersecurity Foundations', 'Essential cybersecurity knowledge covering fundamental concepts, threat landscape, and defensive strategies.', 'General', 'Beginner', 150,
 ARRAY['Understand threat landscape', 'Implement basic security controls', 'Recognize social engineering', 'Practice incident response'],
 ARRAY[],
 '{"modules": [{"title": "Threat Landscape", "duration": 40}, {"title": "Security Controls", "duration": 50}, {"title": "Social Engineering", "duration": 30}, {"title": "Incident Response", "duration": 30}]}'::jsonb);

-- Insert sample nessus labs
INSERT INTO public.nessus_labs (title, description, difficulty, duration_minutes, objectives, instructions, vulnerabilities, lab_type) VALUES
('Vulnerability Assessment Basics', 'Learn to configure and run your first Nessus scan on a test network', 'Beginner', 45,
 ARRAY['Understanding Nessus interface and basic navigation', 'Configure a basic network scan', 'Execute vulnerability scan on test network', 'Interpret scan results and vulnerability ratings', 'Generate basic vulnerability report'],
 ARRAY['Start by typing help to see available commands', 'Create a new scan using nessus --scan-new', 'List all scans with nessus --scan-list', 'Run your scan using nessus --scan-run scan_001', 'View results with nessus --results scan_001'],
 12, 'Guided Lab'),
 
('Web Application Scanning', 'Advanced web app vulnerability detection using Nessus plugins', 'Intermediate', 90,
 ARRAY['Configure web application scan templates', 'Identify common web vulnerabilities (OWASP Top 10)', 'Analyze web application scan results', 'Understand false positives in web scanning', 'Prioritize web application vulnerabilities'],
 ARRAY['Configure a web application scan targeting port 80/443', 'Enable web application plugins in scan policy', 'Execute comprehensive web app scan', 'Analyze results for SQL injection, XSS, and other web vulns', 'Generate detailed web application security report'],
 28, 'Hands-on Lab'),
 
('Network Infrastructure Assessment', 'Comprehensive network scanning and vulnerability prioritization', 'Advanced', 120,
 ARRAY['Design comprehensive network scan strategy', 'Configure advanced scan policies', 'Analyze network topology and services', 'Prioritize vulnerabilities by business impact', 'Create executive-level vulnerability reports'],
 ARRAY['Plan multi-subnet network reconnaissance', 'Configure credentialed vs non-credentialed scans', 'Execute full network infrastructure assessment', 'Correlate vulnerabilities across network segments', 'Develop remediation timeline and priorities'],
 45, 'Challenge Lab'),
 
('Industrial Control Systems Scan', 'Specialized scanning techniques for OT/ICS environments', 'Expert', 150,
 ARRAY['Understand OT/ICS network architecture', 'Configure safe scanning for industrial systems', 'Identify ICS-specific vulnerabilities', 'Assess SCADA and HMI security', 'Develop OT-aware vulnerability management'],
 ARRAY['Review ICS network topology and protocols', 'Configure low-impact scanning for operational systems', 'Execute specialized ICS vulnerability assessment', 'Analyze results for operational vs security impact', 'Create OT-specific remediation recommendations'],
 67, 'Expert Lab');

-- Insert sample badges
INSERT INTO public.badges (name, description, category, icon, requirements, points_value) VALUES
('Nessus Expert', 'Completed all Nessus labs with excellent scores', 'technical', 'shield', '{"completed_labs": 4, "min_score": 90}'::jsonb, 500),
('Healthcare Specialist', 'HIPAA compliance and healthcare security expert', 'industry', 'heart', '{"completed_path": "healthcare", "assessment_score": 85}'::jsonb, 300),
('Vulnerability Hunter', 'Found and analyzed 50+ vulnerabilities', 'achievement', 'target', '{"vulnerabilities_found": 50}'::jsonb, 200),
('Team Player', 'Helped teammates and collaborated effectively', 'social', 'users', '{"helped_users": 10}'::jsonb, 150),
('Speed Demon', 'Completed lab in record time', 'performance', 'zap', '{"completion_time": 900}'::jsonb, 100),
('First Steps', 'Completed your first cybersecurity lab', 'achievement', 'play', '{"first_lab": true}'::jsonb, 50),
('Streak Master', 'Maintained 30-day learning streak', 'performance', 'flame', '{"streak_days": 30}'::jsonb, 250),
('Assessment Ace', 'Scored 100% on security assessment', 'academic', 'award', '{"perfect_score": true}'::jsonb, 200);