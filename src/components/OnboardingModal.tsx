import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Trophy, Calendar, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const [step, setStep] = useState(0);

    const steps = [
        {
            icon: Sparkles,
            title: 'Chào mừng đến với LMS!',
            description: 'Hệ thống học tập với gamification đầy đủ để giúp bạn học hiệu quả và thú vị hơn!',
            color: 'text-blue-500'
        },
        {
            icon: Zap,
            title: 'Kiếm XP & Level Up',
            description: 'Hoàn thành bài học để kiếm XP, lên level và mở khóa achievements!',
            color: 'text-purple-500'
        },
        {
            icon: Calendar,
            title: 'Duy trì Streak',
            description: 'Học mỗi ngày để giữ streak và nhận bonus XP. Càng dài càng tốt!',
            color: 'text-orange-500'
        },
        {
            icon: Trophy,
            title: 'Tranh tài Leaderboard',
            description: 'So tài với học sinh khác và leo lên top bảng xếp hạng!',
            color: 'text-yellow-500'
        }
    ];

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            localStorage.setItem('onboarding_completed', 'true');
            onClose();
        } else {
            setStep(step + 1);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('onboarding_completed', 'true');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className={`p-4 rounded-full bg-muted ${currentStep.color}`}>
                            <currentStep.icon className="h-12 w-12" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        {currentStep.title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {currentStep.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center gap-2 my-4">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all ${index === step ? 'bg-primary w-6' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {!isLastStep && (
                        <Button variant="ghost" onClick={handleSkip} className="flex-1">
                            Bỏ qua
                        </Button>
                    )}
                    <Button onClick={handleNext} className="flex-1 gap-2">
                        {isLastStep ? 'Bắt đầu học!' : 'Tiếp theo'}
                        {!isLastStep && <ArrowRight className="h-4 w-4" />}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
