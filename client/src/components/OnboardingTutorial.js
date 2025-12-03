import React, { useState, useEffect } from 'react';
import './OnboardingTutorial.css';

function OnboardingTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      title: '⚾ Welcome to Baseball PWA!',
      description: 'Your personal baseball task manager for training, games, and equipment tracking.',
      icon: '👋',
      position: 'center'
    },
    {
      title: '📊 Dashboard',
      description: 'View your task statistics and upcoming activities at a glance.',
      icon: '📊',
      position: 'center'
    },
    {
      title: '✅ Manage Tasks',
      description: 'Create, edit, and organize your baseball tasks. Filter by status: Pending, In Progress, or Completed.',
      icon: '✅',
      position: 'center'
    },
    {
      title: '🏷️ Task Categories',
      description: 'Organize tasks by type: Training 🏋️, Games ⚾, Equipment 🧤, Team Meetings 👥, and more!',
      icon: '🏷️',
      position: 'center'
    },
    {
      title: '👤 Your Profile',
      description: 'View your account information and track your baseball stats.',
      icon: '👤',
      position: 'center'
    },
    {
      title: '🎉 You\'re All Set!',
      description: 'Start managing your baseball activities like a pro. Click "Get Started" to begin!',
      icon: '🚀',
      position: 'center'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) {
    return null;
  }

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-content">
        <button className="onboarding-skip" onClick={handleSkip}>
          Skip Tutorial
        </button>

        <div className="onboarding-card">
          <div className="onboarding-icon">{step.icon}</div>
          
          <h2 className="onboarding-title">{step.title}</h2>
          
          <p className="onboarding-description">{step.description}</p>

          <div className="onboarding-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>

          <div className="onboarding-actions">
            {currentStep > 0 && (
              <button className="btn-previous" onClick={handlePrevious}>
                ← Previous
              </button>
            )}
            
            <button className="btn-next" onClick={handleNext}>
              {isLastStep ? 'Get Started 🚀' : 'Next →'}
            </button>
          </div>

          <div className="onboarding-counter">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnboardingTutorial;
