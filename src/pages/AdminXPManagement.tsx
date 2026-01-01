import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, Zap, Search, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminXPManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [xpAmount, setXpAmount] = useState<number>(100);
    const queryClient = useQueryClient();

    // Get all students with gamification profiles
    const { data: students, isLoading } = useQuery({
        queryKey: ['admin-students'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('student_gamification')
                .select(`
          user_id,
          total_xp,
          current_level,
          current_streak,
          profiles!inner(full_name, email)
        `)
                .order('total_xp', { ascending: false });

            if (error) throw error;
            return data;
        }
    });

    // Adjust XP mutation
    const adjustXP = useMutation({
        mutationFn: async ({ userId, amount, isAdd }: { userId: string; amount: number; isAdd: boolean }) => {
            const finalAmount = isAdd ? amount : -amount;

            const { error } = await supabase.rpc('award_xp', {
                p_user_id: userId,
                p_xp_amount: finalAmount,
                p_source: 'admin_adjustment',
                p_description: `Admin ${isAdd ? 'added' : 'subtracted'} ${Math.abs(finalAmount)} XP`
            });

            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            toast.success(`${variables.isAdd ? 'Added' : 'Subtracted'} ${variables.amount} XP!`);
            queryClient.invalidateQueries({ queryKey: ['admin-students'] });
            setXpAmount(100);
        },
        onError: () => {
            toast.error('Failed to adjust XP');
        }
    });

    const filteredStudents = students?.filter(s =>
        s.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link to="/admin">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Admin
                    </Link>
                </Button>

                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <Zap className="h-8 w-8 text-purple-500" />
                    XP Management
                </h1>
                <p className="text-muted-foreground">
                    Add or subtract XP from students for testing purposes
                </p>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Students List */}
            <div className="grid gap-4">
                {isLoading ? (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                            Loading students...
                        </CardContent>
                    </Card>
                ) : filteredStudents && filteredStudents.length > 0 ? (
                    filteredStudents.map((student: any) => (
                        <Card key={student.user_id} className={selectedUser === student.user_id ? 'border-primary' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div>
                                        <div className="font-bold">{student.profiles?.full_name || 'Unknown'}</div>
                                        <div className="text-sm font-normal text-muted-foreground">
                                            {student.profiles?.email}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <Badge variant="secondary" className="mb-1">
                                                Level {student.current_level}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-purple-600">
                                                <Zap className="h-4 w-4" />
                                                <span className="font-bold">{student.total_xp} XP</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        value={selectedUser === student.user_id ? xpAmount : 100}
                                        onChange={(e) => {
                                            setSelectedUser(student.user_id);
                                            setXpAmount(parseInt(e.target.value) || 0);
                                        }}
                                        onFocus={() => setSelectedUser(student.user_id)}
                                        className="w-32"
                                        placeholder="Amount"
                                    />

                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => adjustXP.mutate({
                                            userId: student.user_id,
                                            amount: selectedUser === student.user_id ? xpAmount : 100,
                                            isAdd: true
                                        })}
                                        disabled={adjustXP.isPending}
                                        className="gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add XP
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => adjustXP.mutate({
                                            userId: student.user_id,
                                            amount: selectedUser === student.user_id ? xpAmount : 100,
                                            isAdd: false
                                        })}
                                        disabled={adjustXP.isPending}
                                        className="gap-2"
                                    >
                                        <Minus className="h-4 w-4" />
                                        Subtract XP
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No students found
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
