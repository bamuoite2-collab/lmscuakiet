-- Shop System Migration
-- XP shop for buying items with earned XP

-- =====================================================
-- 1. SHOP ITEMS TABLE
-- =====================================================
create table if not exists shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text check (category in ('avatar', 'theme', 'powerup', 'badge', 'other')),
  xp_cost integer not null check (xp_cost >= 0),
  icon text,
  image_url text,
  metadata jsonb default '{}'::jsonb,
  is_available boolean default true,
  stock_limit integer, -- null = unlimited
  created_at timestamptz default now()
);

create index if not exists idx_shop_items_category on shop_items(category, is_available);

-- =====================================================
-- 2. USER INVENTORY TABLE
-- =====================================================
create table if not exists user_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  shop_item_id uuid references shop_items(id) on delete cascade not null,
  purchased_at timestamptz default now(),
  is_equipped boolean default false,
  unique(user_id, shop_item_id)
);

create index if not exists idx_user_inventory_user on user_inventory(user_id);
create index if not exists idx_user_inventory_equipped on user_inventory(user_id, is_equipped);

-- =====================================================
-- 3. PURCHASE TRANSACTIONS TABLE
-- =====================================================
create table if not exists purchase_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  shop_item_id uuid references shop_items(id) on delete set null,
  xp_spent integer not null,
  purchased_at timestamptz default now()
);

create index if not exists idx_purchase_transactions_user on purchase_transactions(user_id);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================

-- shop_items: public read
alter table shop_items enable row level security;
create policy "Anyone can view shop items" on shop_items for select using (true);
create policy "Only admins can manage shop items" on shop_items for all 
  using (has_role(auth.uid(), 'admin'::app_role));

-- user_inventory: users own data
alter table user_inventory enable row level security;
create policy "Users can view own inventory" on user_inventory for select 
  using (auth.uid() = user_id);
create policy "Users can insert own inventory" on user_inventory for insert 
  with check (auth.uid() = user_id);
create policy "Users can update own inventory" on user_inventory for update 
  using (auth.uid() = user_id);

-- purchase_transactions: users own data
alter table purchase_transactions enable row level security;
create policy "Users can view own purchases" on purchase_transactions for select 
  using (auth.uid() = user_id);
create policy "Users can insert own purchases" on purchase_transactions for insert 
  with check (auth.uid() = user_id);

-- =====================================================
-- 5. RPC FUNCTIONS
-- =====================================================

-- Purchase item function
create or replace function purchase_shop_item(
  p_user_id uuid,
  p_item_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
  v_user_xp integer;
  v_already_owned boolean;
begin
  -- Get item details
  select * into v_item from shop_items where id = p_item_id and is_available = true;
  
  if not found then
    return jsonb_build_object('success', false, 'error', 'Item not available');
  end if;
  
  -- Check if already owned
  select exists(
    select 1 from user_inventory 
    where user_id = p_user_id and shop_item_id = p_item_id
  ) into v_already_owned;
  
  if v_already_owned then
    return jsonb_build_object('success', false, 'error', 'Already owned');
  end if;
  
  -- Check user XP balance
  select total_xp into v_user_xp 
  from gamification_profiles 
  where user_id = p_user_id;
  
  if v_user_xp is null or v_user_xp < v_item.xp_cost then
    return jsonb_build_object('success', false, 'error', 'Insufficient XP');
  end if;
  
  -- Deduct XP (create negative transaction)
  insert into xp_transactions (user_id, xp_amount, source_type, description)
  values (p_user_id, -v_item.xp_cost, 'shop_purchase', v_item.name);
  
  -- Add to inventory
  insert into user_inventory (user_id, shop_item_id)
  values (p_user_id, p_item_id);
  
  -- Record purchase
  insert into purchase_transactions (user_id, shop_item_id, xp_spent)
  values (p_user_id, p_item_id, v_item.xp_cost);
  
  return jsonb_build_object(
    'success', true,
    'item_name', v_item.name,
    'xp_spent', v_item.xp_cost
  );
end;
$$;

-- Equip item function
create or replace function equip_shop_item(
  p_user_id uuid,
  p_item_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item_category text;
begin
  -- Get item category
  select si.category into v_item_category
  from user_inventory ui
  join shop_items si on ui.shop_item_id = si.id
  where ui.user_id = p_user_id and ui.shop_item_id = p_item_id;
  
  if not found then
    return jsonb_build_object('success', false, 'error', 'Item not owned');
  end if;
  
  -- Unequip other items in same category
  update user_inventory ui
  set is_equipped = false
  from shop_items si
  where ui.user_id = p_user_id 
    and ui.shop_item_id = si.id
    and si.category = v_item_category;
  
  -- Equip this item
  update user_inventory
  set is_equipped = true
  where user_id = p_user_id and shop_item_id = p_item_id;
  
  return jsonb_build_object('success', true);
end;
$$;

-- =====================================================
-- 6. SAMPLE SHOP ITEMS
-- =====================================================

-- Avatars
insert into shop_items (name, description, category, xp_cost, icon) values
  ('Avatar Rocket', 'Avatar hình tên lửa', 'avatar', 100, '🚀'),
  ('Avatar Star', 'Avatar ngôi sao sáng', 'avatar', 150, '⭐'),
  ('Avatar Trophy', 'Avatar cúp vàng', 'avatar', 200, '🏆'),
  ('Avatar Crown', 'Avatar vương miện', 'avatar', 300, '👑');

-- Themes
insert into shop_items (name, description, category, xp_cost, icon) values
  ('Dark Purple Theme', 'Giao diện tím đen', 'theme', 250, '🟣'),
  ('Ocean Blue Theme', 'Giao diện xanh biển', 'theme', 250, '🌊'),
  ('Sunset Theme', 'Giao diện hoàng hôn', 'theme', 350, '🌅');

-- Power-ups
insert into shop_items (name, description, category, xp_cost, icon) values
  ('XP Boost 2x', 'Nhân đôi XP trong 1 giờ', 'powerup', 500, '⚡'),
  ('Streak Shield', 'Bảo vệ streak 1 ngày', 'powerup', 400, '🛡️'),
  ('Time Freeze', 'Tạm dừng đếm ngược quiz 30s', 'powerup', 300, '⏰');

-- Badges
insert into shop_items (name, description, category, xp_cost, icon) values
  ('VIP Badge', 'Huy hiệu VIP', 'badge', 1000, '💎'),
  ('Legend Badge', 'Huy hiệu huyền thoại', 'badge', 2000, '🔥'),
  ('Master Badge', 'Huy hiệu bậc thầy', 'badge', 5000, '👨‍🎓');
