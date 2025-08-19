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