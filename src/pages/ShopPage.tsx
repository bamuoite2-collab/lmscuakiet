import { useShop } from '@/hooks/useShop';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { Zap, ShoppingBag, Check, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ShopPage() {
    const { shopItems, inventory, isLoading, purchaseItem, isPurchasing, equipItem, isOwned } = useShop();
    const { gamificationProfile } = useGamification();

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Đang tải cửa hàng..." />;
    }

    const categories = [
        { value: 'all', label: 'Tất cả', icon: '🎪' },
        { value: 'avatar', label: 'Avatar', icon: '👤' },
        { value: 'theme', label: 'Giao diện', icon: '🎨' },
        { value: 'powerup', label: 'Power-up', icon: '⚡' },
        { value: 'badge', label: 'Huy hiệu', icon: '🏅' }
    ];

    const filterItems = (category: string) => {
        if (category === 'all') return shopItems;
        return shopItems?.filter(item => item.category === category);
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link to="/">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại Dashboard
                        </Link>
                    </Button>

                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                        <ShoppingBag className="h-10 w-10 text-blue-500" />
                        Cửa Hàng XP
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Dùng XP để mua vật phẩm độc đáo!
                    </p>
                </div>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="h-5 w-5 text-purple-600" />
                            <span className="text-sm text-muted-foreground">XP hiện tại</span>
                        </div>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                            {gamificationProfile?.total_xp || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Preview */}
            {inventory && inventory.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Vật Phẩm Đã Sở Hữu ({inventory.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 flex-wrap">
                            {inventory.map(item => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border"
                                >
                                    <span className="text-2xl">{item.shop_item.icon}</span>
                                    <span className="text-sm font-medium">{item.shop_item.name}</span>
                                    {item.is_equipped && (
                                        <Badge variant="default" className="text-xs">Đang dùng</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Shop Items */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    {categories.map(cat => (
                        <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
                            <span>{cat.icon}</span>
                            <span className="hidden sm:inline">{cat.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(cat => (
                    <TabsContent key={cat.value} value={cat.value} className="mt-6">
                        {filterItems(cat.value)?.length === 0 ? (
                            <EmptyState
                                icon={ShoppingBag}
                                title="Chưa có vật phẩm"
                                description={`Danh mục ${cat.label} đang được cập nhật`}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterItems(cat.value)?.map((item, index) => {
                                    const owned = isOwned(item.id);
                                    const canAfford = (gamificationProfile?.total_xp || 0) >= item.xp_cost;
                                    const inventoryItem = inventory?.find(inv => inv.shop_item_id === item.id);

                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card className={`h-full ${owned ? 'border-green-500' : ''}`}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="text-5xl">{item.icon}</div>
                                                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900">
                                                            <Zap className="h-4 w-4 text-purple-600" />
                                                            <span className="font-bold text-purple-700 dark:text-purple-300">
                                                                {item.xp_cost}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        {item.description}
                                                    </p>

                                                    {owned ? (
                                                        <div className="space-y-2">
                                                            <Badge variant="default" className="w-full flex items-center justify-center gap-1">
                                                                <Check className="h-4 w-4" />
                                                                Đã sở hữu
                                                            </Badge>
                                                            {item.category !== 'powerup' && (
                                                                <Button
                                                                    variant={inventoryItem?.is_equipped ? "default" : "outline"}
                                                                    size="sm"
                                                                    className="w-full"
                                                                    onClick={() => equipItem(item.id)}
                                                                    disabled={inventoryItem?.is_equipped}
                                                                >
                                                                    {inventoryItem?.is_equipped ? 'Đang trang bị' : 'Trang bị'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            className="w-full gap-2"
                                                            onClick={() => purchaseItem(item.id)}
                                                            disabled={!canAfford || isPurchasing}
                                                        >
                                                            {!canAfford ? (
                                                                <>
                                                                    <Lock className="h-4 w-4" />
                                                                    Không đủ XP
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShoppingBag className="h-4 w-4" />
                                                                    Mua ngay
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
