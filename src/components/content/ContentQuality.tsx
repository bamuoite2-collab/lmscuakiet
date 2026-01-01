import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface RealWorldExampleProps {
    title?: string;
    children: ReactNode;
}

export function RealWorldExample({ title, children }: RealWorldExampleProps) {
    return (
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                    {title || 'Ứng Dụng Thực Tế'}
                </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                {children}
            </CardContent>
        </Card>
    );
}

interface WhyLearnThisProps {
    children: ReactNode;
}

export function WhyLearnThis({ children }: WhyLearnThisProps) {
    return (
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Tại Sao Học Cái Này?
                </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                {children}
            </CardContent>
        </Card>
    );
}
