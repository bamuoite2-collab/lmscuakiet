import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ShopItem {
    id: string;
    name: string;
    description: string | null;
    category: 'avatar' | 'theme' | 'powerup' | 'badge' | 'other';
    xp_cost: number;
    icon: string | null;
    image_url?: string | null;
    metadata: Record<string, unknown>;
    is_available: boolean;
}

export interface InventoryItem {
    id: string;
    user_id: string;
    shop_item_id: string;
    purchased_at: string;
    is_equipped: boolean;
    shop_item: ShopItem;
}

interface PurchaseResult {
    success: boolean;
    item_name?: string;
    xp_spent?: number;
    error?: string;
}

interface EquipResult {
    success: boolean;
    error?: string;
}

export function useShop() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Get all shop items
    const { data: shopItems, isLoading: loadingItems } = useQuery<ShopItem[]>({
        queryKey: ['shop-items'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('shop_items')
                .select('*')
                .eq('is_available', true)
                .order('xp_cost');

            if (error) throw error;
            return (data || []) as unknown as ShopItem[];
        },
        staleTime: 1000 * 60 * 10 // 10 minutes
    });

    // Get user inventory
    const { data: inventory, isLoading: loadingInventory } = useQuery<InventoryItem[]>({
        queryKey: ['user-inventory', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('user_inventory')
                .select(`
                    *,
                    shop_item:shop_items(*)
                `)
                .eq('user_id', user.id);

            if (error) throw error;
            return (data || []) as unknown as InventoryItem[];
        },
        enabled: !!user,
        staleTime: 1000 * 30 // 30 seconds
    });

    // Purchase item
    const purchaseMutation = useMutation({
        mutationFn: async (itemId: string) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('purchase_shop_item', {
                p_user_id: user.id,
                p_item_id: itemId
            });

            if (error) throw error;

            const result = data as unknown as PurchaseResult;
            if (!result?.success) {
                throw new Error(result?.error || 'Unknown error');
            }

            return result;
        },
        onSuccess: (data) => {
            toast.success(`Đã mua ${data.item_name || 'vật phẩm'}!`, {
                description: `-${data.xp_spent || 0} XP`
            });
            queryClient.invalidateQueries({ queryKey: ['user-inventory'] });
            queryClient.invalidateQueries({ queryKey: ['gamification'] });
        },
        onError: (error: Error) => {
            const errorMessages: Record<string, string> = {
                'Item not available': 'Vật phẩm không khả dụng',
                'Already owned': 'Bạn đã sở hữu vật phẩm này',
                'Insufficient XP': 'Không đủ XP để mua'
            };

            toast.error('Mua thất bại', {
                description: errorMessages[error.message] || error.message
            });
        }
    });

    // Equip item
    const equipMutation = useMutation({
        mutationFn: async (itemId: string) => {
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('equip_shop_item', {
                p_user_id: user.id,
                p_item_id: itemId
            });

            if (error) throw error;

            const result = data as unknown as EquipResult;
            if (!result?.success) {
                throw new Error(result?.error || 'Unknown error');
            }

            return result;
        },
        onSuccess: () => {
            toast.success('Đã trang bị!');
            queryClient.invalidateQueries({ queryKey: ['user-inventory'] });
        },
        onError: (error: Error) => {
            toast.error('Trang bị thất bại', {
                description: error.message
            });
        }
    });

    // Check if item is owned
    const isOwned = (itemId: string) => {
        return inventory?.some(inv => inv.shop_item_id === itemId) || false;
    };

    // Get equipped item by category
    const getEquippedItem = (category: string) => {
        return inventory?.find(inv =>
            inv.is_equipped && inv.shop_item?.category === category
        );
    };

    return {
        shopItems,
        inventory,
        isLoading: loadingItems || loadingInventory,
        purchaseItem: purchaseMutation.mutate,
        isPurchasing: purchaseMutation.isPending,
        equipItem: equipMutation.mutate,
        isEquipping: equipMutation.isPending,
        isOwned,
        getEquippedItem
    };
}
