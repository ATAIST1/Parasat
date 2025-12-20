import { useState } from 'react';
import { Home, Search, PlusCircle, MessageCircle, User, Building2 } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import RoleSelectionScreen from './components/RoleSelectionScreen';
import OnboardingScreen from './components/OnboardingScreen';
import FeedScreen from './components/FeedScreen';
import SearchScreen from './components/SearchScreen';
import CreateScreen from './components/CreateScreen';
import ChatsScreen from './components/ChatsScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ProjectDetailScreen from './components/ProjectDetailScreen';
import SettingsScreen from './components/SettingsScreen';
import PricingScreen from './components/PricingScreen';
import CalculatorScreen from './components/CalculatorScreen';
import ParasatScreen from './components/ParasatScreen';
import SubscriptionsScreen from './components/SubscriptionsScreen';


import NewsDetailScreen from './components/NewsDetailScreen'; 
import ResetPasswordScreen from './components/ResetPasswordScreen';

import { Toaster } from './components/ui/sonner';



export type UserRole = 'startup' | 'investor' | 'mentor' | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  location?: string;
  onboarded?: boolean;
}

export type Screen =
  | 'welcome'
  | 'auth'
  | 'role-selection'
  | 'onboarding'
  | 'feed'
  | 'search'
  | 'create'
  | 'chats'
  | 'chat'
  | 'profile'
  | 'favorites'
  | 'project-detail'
  | 'settings'
  | 'pricing'
  | 'calculator'
  | 'parasat'
  | 'subscriptions'
  | 'parasat-news-detail';
  

function App() {
  const path = window.location.pathname;

  if (path === '/reset-password') {
    return (
      <div className="min-h-screen bg-white">
        <ResetPasswordScreen />
        <Toaster />
      </div>
    );
  }

    const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
    const [lastScreen, setLastScreen] = useState<Screen | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [chatParams, setChatParams] = useState<{ conversationId: string; title: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const openChat = (conversationId: string, title: string) => {
        setChatParams({ conversationId, title });
        setLastScreen(currentScreen);
        setCurrentScreen('chat');
    };



  const handleLogin = (email: string, role: UserRole) => {
    setUser({
      id: '1',
      email,
      role,
      onboarded: true,
    });
    setCurrentScreen('feed');
  };

  const handleRegister = (email: string) => {
    setUser({
      id: '1',
      email,
      role: null,
      onboarded: false,
    });
    setCurrentScreen('create');
  };

  const handleRoleSelect = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (data: any) => {
    if (user) {
      setUser({ ...user, ...data, onboarded: true });
      setCurrentScreen('feed');
    }
  };

    const handleProjectClick = (projectId: string) => {
        setSelectedProjectId(projectId);
        setLastScreen(currentScreen);
        setCurrentScreen('project-detail');
    };

    const navigateTo = (screen: Screen) => {
        setLastScreen(currentScreen);
        setCurrentScreen(screen);
    };


  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
<WelcomeScreen
  onLogin={() => {
    setAuthMode('login');
    setCurrentScreen('auth');
  }}
  onRegister={() => {
    setAuthMode('register');
    setCurrentScreen('auth');
  }}
  onContinueAsGuest={() => {
    setUser({ id: 'guest', email: '', role: null });
    setCurrentScreen('feed');
  }}
/>

        );
      case 'auth':
        return (
<AuthScreen
  onLogin={handleLogin}
  onRegister={handleRegister}
  onBack={() => setCurrentScreen('welcome')}
  mode={authMode}
/>

        );
      case 'role-selection':
        return (
          <RoleSelectionScreen
            onRoleSelect={handleRoleSelect}
          />
        );
      case 'onboarding':
        return (
          <OnboardingScreen
            role={user?.role || 'startup'}
            onComplete={handleOnboardingComplete}
          />
        );
case 'feed':
  return (
    <FeedScreen
      onProjectClick={handleProjectClick}
      navigateTo={navigateTo}
      openChat={openChat}
    />
  );


      case 'search':
        return (
          <SearchScreen
            onProjectClick={handleProjectClick}
          />
        );
      case 'create':
        return (
          <CreateScreen
            userRole={user?.role || 'startup'}
            navigateTo={navigateTo}
          />
        );
        case 'chats':
            return (
                <ChatsScreen
                    navigateTo={navigateTo}
                    openChat={openChat}
                />
            );
case 'chat':
  return (
    chatParams && (
      <ChatScreen
        onBack={() => setCurrentScreen('chats')}
        conversationId={chatParams.conversationId}
        title={chatParams.title}
      />
    )
  );


      case 'profile':
        return (
          <ProfileScreen
            user={user}
            navigateTo={navigateTo}
          />
        );
      case 'favorites':
        return (
            <FavoritesScreen
                onProjectClick={handleProjectClick}
                navigateTo={navigateTo}
            />
        );
      case 'project-detail':
        return (
            <ProjectDetailScreen
                projectId={selectedProjectId || '1'}
                onBack={() => {
                    setCurrentScreen(lastScreen ?? 'feed');
                }}
                navigateTo={navigateTo}
            />
        );
      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setCurrentScreen('profile')}
          />
        );
      case 'pricing':
        return (
          <PricingScreen
            onBack={() => setCurrentScreen('profile')}
          />
        );
      case 'calculator':
        return (
          <CalculatorScreen
            navigateTo={navigateTo}
          />
        );
      case 'subscriptions':
  return (
    <SubscriptionsScreen
      onBack={() => setCurrentScreen('profile')}
      userRole={user?.role}
    />
  );
      case 'parasat-news-detail':
      return (
        <NewsDetailScreen
          newsId={selectedNewsId || ''}
          onBack={() => setCurrentScreen('parasat')}
          onOpenNews={(id) => {
              setSelectedNewsId(id);
              setLastScreen(currentScreen);
              setCurrentScreen('parasat-news-detail');

          }}
        />
      );
      case 'parasat':
        return (
        //   <ParasatScreen
        //     navigateTo={navigateTo}
        //   />
        // );
          <ParasatScreen
            navigateTo={navigateTo}
            openNews={(id: string) => {
                setSelectedNewsId(id);
                setLastScreen(currentScreen);
                setCurrentScreen('parasat-news-detail');

            }}
          />
        );


      default:
        return null;
    }
  };

  const showBottomNav = user && ['feed', 'parasat', 'create', 'chats', 'profile'].includes(currentScreen);

  return (
      //<div className="min-h-screen flex flex-col relative">
      // это под мобилку в виде фигмы, не убирать!

      <div className="min-h-screen flex flex-col relative">
      <main className={`flex-1 ${showBottomNav ? 'pb-16' : ''}`}>
        {renderScreen()}
      </main>

      {showBottomNav && (
        //<nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-2">
          // это под мобильное, как в фигме, не убирать

          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentScreen('feed')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'feed' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Лента</span>
            </button>
            <button
              onClick={() => setCurrentScreen('parasat')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'parasat' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs">Parasat</span>
            </button>
            <button
              onClick={() => setCurrentScreen('create')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'create' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs">Создать</span>
            </button>
            <button
              onClick={() => setCurrentScreen('chats')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'chats' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Чаты</span>
            </button>
            <button
              onClick={() => setCurrentScreen('profile')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'profile' ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Профиль</span>
            </button>
          </div>
        </nav>
      )}

      <Toaster />
    </div>
  );
}

export default App;