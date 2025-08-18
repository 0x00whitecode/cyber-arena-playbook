-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student',
  department TEXT,
  specialization TEXT,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  total_hours DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create learning paths table
CREATE TABLE public.learning_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  duration_minutes INTEGER,
  objectives TEXT[],
  prerequisites TEXT[],
  modules JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nessus labs table
CREATE TABLE public.nessus_labs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL,
  duration_minutes INTEGER,
  objectives TEXT[],
  instructions TEXT[],
  commands JSONB,
  vulnerabilities INTEGER DEFAULT 0,
  lab_type TEXT DEFAULT 'Guided Lab',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'lab' or 'path' or 'assessment'
  item_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  progress_percentage DECIMAL DEFAULT 0,
  completed_objectives INTEGER DEFAULT 0,
  total_objectives INTEGER DEFAULT 0,
  commands_executed TEXT[],
  time_spent_minutes DECIMAL DEFAULT 0,
  score DECIMAL,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create scan results table
CREATE TABLE public.scan_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id UUID REFERENCES public.nessus_labs(id) ON DELETE CASCADE,
  scan_id TEXT NOT NULL,
  scan_type TEXT NOT NULL,
  target_network TEXT,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  progress DECIMAL DEFAULT 0,
  vulnerabilities_found JSONB DEFAULT '[]'::jsonb,
  hosts_scanned INTEGER DEFAULT 0,
  scan_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL, -- 'technical', 'achievement', 'industry', 'social', 'performance'
  icon TEXT,
  requirements JSONB,
  points_value INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  total_questions INTEGER,
  score DECIMAL,
  time_spent_seconds INTEGER,
  answers JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nessus_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning paths policies (public read)
CREATE POLICY "Anyone can view learning paths" ON public.learning_paths FOR SELECT USING (true);

-- Nessus labs policies (public read)
CREATE POLICY "Anyone can view nessus labs" ON public.nessus_labs FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Scan results policies
CREATE POLICY "Users can view their own scan results" ON public.scan_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scan results" ON public.scan_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scan results" ON public.scan_results FOR UPDATE USING (auth.uid() = user_id);

-- Badges policies (public read)
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User badges policies
CREATE POLICY "Users can view all user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessments policies
CREATE POLICY "Users can view their own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON public.assessments FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_nessus_labs_updated_at BEFORE UPDATE ON public.nessus_labs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scan_results_updated_at BEFORE UPDATE ON public.scan_results FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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