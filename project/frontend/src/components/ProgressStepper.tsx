import React from 'react'
import { Check, Circle } from 'lucide-react'

export interface Step {
  id: string
  title: string
  description: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId)
  }

  const isStepCurrent = (stepId: string) => {
    return stepId === currentStep
  }

  const isStepAccessible = (index: number) => {
    return index <= getCurrentStepIndex()
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <div className={`
                relative flex items-center justify-center w-10 h-10 rounded-full border-2
                transition-all duration-200 mb-2
                ${isStepCompleted(step.id)
                  ? 'bg-accent-500 border-accent-500 text-white'
                  : isStepCurrent(step.id)
                  ? 'bg-primary-500 border-primary-500 text-white animate-pulse'
                  : isStepAccessible(index)
                  ? 'bg-gray-100 border-gray-300 text-gray-400'
                  : 'bg-gray-50 border-gray-200 text-gray-300'
                }
              `}>
                {isStepCompleted(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Circle className="h-3 w-3 fill-current" />
                )}
              </div>

              {/* Step Content */}
              <div className="text-center max-w-[120px]">
                <h4 className={`
                  text-sm font-medium mb-1
                  ${isStepCurrent(step.id) || isStepCompleted(step.id)
                    ? 'text-gray-900'
                    : 'text-gray-500'
                  }
                `}>
                  {step.title}
                </h4>
                <p className={`
                  text-xs leading-tight
                  ${isStepCurrent(step.id)
                    ? 'text-primary-600'
                    : isStepCompleted(step.id)
                    ? 'text-gray-600'
                    : 'text-gray-400'
                  }
                `}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 mt-[-40px] transition-colors duration-300
                ${isStepCompleted(steps[index + 1].id) || 
                  (isStepCompleted(step.id) && isStepAccessible(index + 1))
                  ? 'bg-accent-500'
                  : 'bg-gray-300'
                }
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}