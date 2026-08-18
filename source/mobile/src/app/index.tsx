import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categoryShare, customers, kpis, orders, products, salesTrend } from '@/data/sales';
import { apiRequest, API_URL } from '@/services/api';

type TabKey = 'dashboard' | 'orders' | 'products' | 'customers' | 'more';
type MorePage = 'menu' | 'reports' | 'ai' | 'settings';

const C = {
  bg: '#07101F',
  panel: '#0D192B',
  panel2: '#101F35',
  border: '#1B2C45',
  text: '#F5F8FF',
  muted: '#8EA0BA',
  primary: '#5B8CFF',
  primary2: '#7A63FF',
  green: '#2FD39A',
  orange: '#FFB454',
  red: '#FF6B7A',
};

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'داشبورد', icon: '⌂' },
  { key: 'orders', label: 'سفارش‌ها', icon: '▣' },
  { key: 'products', label: 'محصولات', icon: '◇' },
  { key: 'customers', label: 'مشتری‌ها', icon: '◎' },
  { key: 'more', label: 'بیشتر', icon: '•••' },
];

const money = (value: number) => `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerActions}>
        <Pressable style={styles.circleButton} onPress={() => Alert.alert('اعلان‌ها', 'اعلان جدیدی ندارید.')}>
          <Text style={styles.circleIcon}>♢</Text>
          <View style={styles.notificationDot} />
        </Pressable>
        <View style={styles.avatar}><Text style={styles.avatarText}>SA</Text></View>
      </View>
      <View style={styles.headerTextWrap}>
        <Text style={styles.pageTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      {!!action && <Text style={styles.sectionAction}>{action}</Text>}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function TrendChart() {
  const max = Math.max(...salesTrend);
  return (
    <Card>
      <SectionTitle title="روند فروش" action="۳۰ روز اخیر" />
      <View style={styles.chartArea}>
        {salesTrend.map((n, i) => (
          <View key={i} style={styles.barColumn}>
            <View style={[styles.bar, { height: Math.max(12, (n / max) * 118) }]} />
            {i % 2 === 0 ? <Text style={styles.chartLabel}>{i + 1}</Text> : <Text style={styles.chartLabel}> </Text>}
          </View>
        ))}
      </View>
      <View style={styles.chartLegend}>
        <Text style={styles.legendValue}>۲۴۸.۶ میلیون تومان</Text>
        <View style={styles.legendRight}><View style={styles.legendDot} /><Text style={styles.legendText}>فروش</Text></View>
      </View>
    </Card>
  );
}

function Dashboard() {
  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Header title="داشبورد فروش" subtitle="خلاصه عملکرد کسب‌وکار" />
      <View style={styles.heroCard}>
        <View style={styles.heroGlow2} />
        <View style={styles.heroGlow} />
        <Text style={styles.heroEyebrow}>درآمد این ماه</Text>
        <Text style={styles.heroValue}>۲۴۸,۶۰۰,۰۰۰</Text>
        <Text style={styles.heroCurrency}>تومان</Text>
        <View style={styles.heroBottom}>
          <View style={styles.upBadge}><Text style={styles.upBadgeText}>↗ ۱۲.۴٪</Text></View>
          <Text style={styles.heroCompare}>نسبت به ماه قبل</Text>
        </View>
      </View>

      <View style={styles.kpiGrid}>
        {kpis.map((item, index) => (
          <Card key={item.label} style={styles.kpiCard}>
            <View style={[styles.kpiIcon, index === 0 && styles.kpiIconPrimary]}><Text style={styles.kpiIconText}>{item.icon}</Text></View>
            <Text style={styles.kpiLabel}>{item.label}</Text>
            <Text style={styles.kpiValue}>{item.value}</Text>
            <Text style={styles.kpiDelta}>{item.delta}</Text>
          </Card>
        ))}
      </View>

      <TrendChart />

      <Card>
        <SectionTitle title="فروش بر اساس دسته‌بندی" />
        <View style={styles.categoryList}>
          {categoryShare.map((c) => (
            <View key={c.label} style={styles.categoryRow}>
              <Text style={styles.categoryPercent}>{c.value}٪</Text>
              <View style={styles.categoryMain}>
                <Text style={styles.categoryLabel}>{c.label}</Text>
                <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${c.value}%` as `${number}%` }]} /></View>
              </View>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle title="سفارش‌های اخیر" action="مشاهده همه" />
        {orders.slice(0, 4).map((o) => <OrderRow key={o.id} order={o} />)}
      </Card>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status === 'تکمیل شده' ? C.green : status === 'لغو شده' ? C.red : C.orange;
  return <View style={[styles.statusPill, { backgroundColor: `${color}18` }]}><Text style={[styles.statusText, { color }]}>{status}</Text></View>;
}

function OrderRow({ order }: { order: (typeof orders)[number] }) {
  return (
    <Pressable style={styles.listRow} onPress={() => Alert.alert(order.id, `${order.customer}\n${money(order.amount)}\n${order.status}`)}>
      <View style={styles.rowLeft}><StatusPill status={order.status} /><Text style={styles.rowDate}>{order.date}</Text></View>
      <View style={styles.rowCenter}><Text style={styles.rowTitle}>{order.customer}</Text><Text style={styles.rowSub}>{money(order.amount)}</Text></View>
      <View style={styles.rowAvatar}><Text style={styles.rowAvatarText}>{order.customer.charAt(0)}</Text></View>
    </Pressable>
  );
}

function OrdersPage() {
  const [query, setQuery] = useState('');
  const filtered = orders.filter((o) => `${o.customer} ${o.id} ${o.status}`.includes(query.trim()));
  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Header title="سفارش‌ها" subtitle={`${orders.length} سفارش ثبت شده`} />
      <SearchBox value={query} onChange={setQuery} placeholder="جستجو در سفارش‌ها..." />
      <View style={styles.filterRow}>
        {['همه', 'تکمیل شده', 'در پردازش', 'لغو شده'].map((x, i) => <View key={x} style={[styles.filterChip, i === 0 && styles.filterChipActive]}><Text style={[styles.filterChipText, i === 0 && styles.filterChipTextActive]}>{x}</Text></View>)}
      </View>
      <Card>{filtered.map((o) => <OrderRow key={o.id} order={o} />)}</Card>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <View style={styles.searchBox}>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.muted} style={styles.searchInput} textAlign="right" />
      <Text style={styles.searchIcon}>⌕</Text>
    </View>
  );
}

function ProductsPage() {
  const [query, setQuery] = useState('');
  const filtered = products.filter((p) => `${p.name} ${p.category}`.includes(query.trim()));
  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Header title="محصولات" subtitle="مدیریت موجودی و فروش محصولات" />
      <SearchBox value={query} onChange={setQuery} placeholder="جستجوی محصول..." />
      {filtered.map((p) => (
        <Card key={p.id} style={styles.productCard}>
          <View style={styles.productTop}>
            <View style={[styles.stockBadge, p.stock < 10 && { backgroundColor: `${C.red}18` }]}><Text style={[styles.stockText, p.stock < 10 && { color: C.red }]}>موجودی {new Intl.NumberFormat('fa-IR').format(p.stock)}</Text></View>
            <View style={styles.productTitleWrap}><Text style={styles.productName}>{p.name}</Text><Text style={styles.productCategory}>{p.category}</Text></View>
            <View style={styles.productIcon}><Text style={styles.productIconText}>◇</Text></View>
          </View>
          <View style={styles.productDivider} />
          <View style={styles.productStats}>
            <View><Text style={styles.productStatLabel}>فروش</Text><Text style={styles.productStatValue}>{new Intl.NumberFormat('fa-IR').format(p.sales)} عدد</Text></View>
            <View><Text style={styles.productStatLabel}>قیمت</Text><Text style={styles.productStatValue}>{money(p.price)}</Text></View>
          </View>
        </Card>
      ))}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function CustomersPage() {
  const [query, setQuery] = useState('');
  const filtered = customers.filter((c) => `${c.name} ${c.email}`.includes(query.trim()));
  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Header title="مشتری‌ها" subtitle="اطلاعات و رفتار خرید مشتریان" />
      <SearchBox value={query} onChange={setQuery} placeholder="جستجوی مشتری..." />
      {filtered.map((c) => (
        <Card key={c.id} style={styles.customerCard}>
          <View style={styles.customerTop}>
            <View style={styles.customerMeta}><Text style={styles.customerName}>{c.name}</Text><Text style={styles.customerEmail}>{c.email}</Text></View>
            <View style={styles.customerAvatar}><Text style={styles.customerAvatarText}>{c.name.charAt(0)}</Text></View>
          </View>
          <View style={styles.customerStats}>
            <View style={styles.customerStat}><Text style={styles.customerStatValue}>{money(c.spent)}</Text><Text style={styles.customerStatLabel}>خرید کل</Text></View>
            <View style={styles.customerStatDivider} />
            <View style={styles.customerStat}><Text style={styles.customerStatValue}>{new Intl.NumberFormat('fa-IR').format(c.orders)}</Text><Text style={styles.customerStatLabel}>سفارش</Text></View>
          </View>
        </Card>
      ))}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function ReportsPage({ back }: { back: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <SubHeader title="گزارش‌ها" back={back} />
      <Card>
        <SectionTitle title="خلاصه عملکرد" action="ماه جاری" />
        <View style={styles.reportGrid}>
          <MiniMetric label="نرخ تبدیل" value="۴.۸٪" delta="+۰.۶٪" />
          <MiniMetric label="حاشیه سود" value="۲۳.۴٪" delta="+۲.۱٪" />
          <MiniMetric label="بازگشت مشتری" value="۳۸٪" delta="+۴.۲٪" />
          <MiniMetric label="لغو سفارش" value="۱.۹٪" delta="-۰.۳٪" />
        </View>
      </Card>
      <TrendChart />
      <Card><SectionTitle title="کانال‌های فروش" />{['وب‌سایت', 'اینستاگرام', 'فروش حضوری', 'مارکت‌پلیس'].map((x, i) => <View key={x} style={styles.channelRow}><Text style={styles.channelValue}>{[44, 28, 18, 10][i]}٪</Text><Text style={styles.channelLabel}>{x}</Text></View>)}</Card>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function MiniMetric({ label, value, delta }: { label: string; value: string; delta: string }) {
  return <View style={styles.miniMetric}><Text style={styles.miniLabel}>{label}</Text><Text style={styles.miniValue}>{value}</Text><Text style={styles.miniDelta}>{delta}</Text></View>;
}

function AIPage({ back }: { back: () => void }) {
  const insights = [
    ['افزایش تقاضا', 'فروش هدفون بی‌سیم در ۷ روز اخیر ۱۸٪ رشد کرده؛ موجودی فعلی برای حدود ۵ روز کافی است.', '↗'],
    ['فرصت فروش', 'مشتریانی که لپ‌تاپ خریده‌اند بیشترین احتمال خرید کیبورد مکانیکی را دارند.', '✦'],
    ['هشدار موجودی', 'موجودی صندلی ارگونومیک به کمتر از ۱۰ عدد رسیده و نیاز به تأمین دارد.', '!'],
  ];
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <SubHeader title="AI Insights" back={back} />
      <View style={styles.aiHero}>
        <Text style={styles.aiIcon}>✦</Text><Text style={styles.aiHeroTitle}>دستیار هوشمند فروش</Text><Text style={styles.aiHeroText}>بر اساس داده‌های فروش، سفارش‌ها و موجودی، پیشنهادهای قابل اقدام دریافت کن.</Text>
      </View>
      {insights.map(([t, d, i]) => <Card key={t} style={styles.insightCard}><View style={styles.insightIcon}><Text style={styles.insightIconText}>{i}</Text></View><View style={styles.insightBody}><Text style={styles.insightTitle}>{t}</Text><Text style={styles.insightText}>{d}</Text></View></Card>)}
      <Text style={styles.inputLabel}>سؤال از دستیار</Text>
      <View style={styles.aiInputWrap}><Pressable style={styles.sendButton}><Text style={styles.sendButtonText}>↑</Text></Pressable><TextInput placeholder="مثلاً پرفروش‌ترین محصول این ماه؟" placeholderTextColor={C.muted} style={styles.aiInput} textAlign="right" /></View>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function SettingsPage({ back }: { back: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [compact, setCompact] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <SubHeader title="تنظیمات" back={back} />
      <Card style={styles.profileCard}><View style={styles.bigAvatar}><Text style={styles.bigAvatarText}>SA</Text></View><Text style={styles.profileName}>مدیر سیستم</Text><Text style={styles.profileEmail}>admin@salesanalytics.local</Text></Card>
      <Card>
        <SettingRow title="اعلان‌های فروش" subtitle="دریافت هشدار سفارش و موجودی" right={<Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: C.primary }} />} />
        <SettingRow title="نمای فشرده" subtitle="کاهش فاصله آیتم‌های لیست" right={<Switch value={compact} onValueChange={setCompact} trackColor={{ true: C.primary }} />} />
        <SettingRow title="آدرس API" subtitle={API_URL || 'حالت آفلاین / داده آزمایشی'} right={<Text style={styles.chevron}>‹</Text>} />
      </Card>
      <Card><SettingRow title="نسخه برنامه" subtitle="1.0.0 · Expo SDK 57" right={<Text style={styles.versionBadge}>57</Text>} /></Card>
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function SettingRow({ title, subtitle, right }: { title: string; subtitle: string; right: React.ReactNode }) {
  return <View style={styles.settingRow}><View style={styles.settingRight}>{right}</View><View style={styles.settingText}><Text style={styles.settingTitle}>{title}</Text><Text style={styles.settingSub}>{subtitle}</Text></View></View>;
}

function SubHeader({ title, back }: { title: string; back: () => void }) {
  return <View style={styles.subHeader}><Pressable onPress={back} style={styles.circleButton}><Text style={styles.backIcon}>‹</Text></Pressable><Text style={styles.pageTitle}>{title}</Text><View style={{ width: 44 }} /></View>;
}

function MorePageView({ page, setPage }: { page: MorePage; setPage: (p: MorePage) => void }) {
  if (page === 'reports') return <ReportsPage back={() => setPage('menu')} />;
  if (page === 'ai') return <AIPage back={() => setPage('menu')} />;
  if (page === 'settings') return <SettingsPage back={() => setPage('menu')} />;
  const items = [
    ['reports', 'گزارش‌ها', 'تحلیل عملکرد و کانال‌های فروش', '▥'],
    ['ai', 'AI Insights', 'پیشنهادها و تحلیل هوشمند داده‌ها', '✦'],
    ['settings', 'تنظیمات', 'پروفایل، اعلان‌ها و اتصال API', '⚙'],
  ] as const;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Header title="بیشتر" subtitle="ابزارها و تنظیمات Sales Analytics" />
      <Card style={styles.brandCard}><View style={styles.brandLogo}><Text style={styles.brandLogoText}>S</Text></View><View><Text style={styles.brandTitle}>Sales Analytics</Text><Text style={styles.brandSub}>Mobile Dashboard</Text></View></Card>
      {items.map(([key, title, desc, icon]) => <Pressable key={key} onPress={() => setPage(key)} style={styles.menuCard}><Text style={styles.menuChevron}>‹</Text><View style={styles.menuText}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuDesc}>{desc}</Text></View><View style={styles.menuIcon}><Text style={styles.menuIconText}>{icon}</Text></View></Pressable>)}
      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@salesanalytics.local');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    const result = await apiRequest<{ access_token?: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    setLoading(false);
    if (API_URL && !result) Alert.alert('اتصال برقرار نشد', 'بک‌اند پاسخ نداد؛ برای مشاهده اپ وارد حالت آزمایشی شوید.');
    else onLogin();
  };
  return (
    <KeyboardAvoidingView style={styles.loginRoot} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.loginSafe}>
        <ScrollView contentContainerStyle={styles.loginContent} keyboardShouldPersistTaps="handled">
          <View style={styles.loginLogo}><Text style={styles.loginLogoText}>S</Text></View>
          <Text style={styles.loginTitle}>Sales Analytics</Text>
          <Text style={styles.loginSub}>به داشبورد مدیریت فروش خوش آمدید</Text>
          <View style={styles.loginForm}>
            <Text style={styles.loginInputLabel}>ایمیل</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.textInput} textAlign="right" placeholderTextColor={C.muted} />
            <Text style={styles.loginInputLabel}>رمز عبور</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.textInput} textAlign="right" placeholderTextColor={C.muted} />
            <Pressable style={styles.loginButton} onPress={submit} disabled={loading}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>ورود به حساب</Text>}</Pressable>
            <Pressable style={styles.demoButton} onPress={onLogin}><Text style={styles.demoButtonText}>ورود آزمایشی بدون بک‌اند</Text></Pressable>
          </View>
          <Text style={styles.loginFoot}>{API_URL ? `API: ${API_URL}` : 'در حال حاضر داده‌های آزمایشی داخلی فعال هستند'}</Text>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<TabKey>('dashboard');
  const [morePage, setMorePage] = useState<MorePage>('menu');
  const body = useMemo(() => {
    switch (tab) {
      case 'orders': return <OrdersPage />;
      case 'products': return <ProductsPage />;
      case 'customers': return <CustomersPage />;
      case 'more': return <MorePageView page={morePage} setPage={setMorePage} />;
      default: return <Dashboard />;
    }
  }, [tab, morePage]);

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {body}
      <View style={styles.bottomNav}>
        {tabs.map((item) => {
          const active = tab === item.key;
          return <Pressable key={item.key} style={styles.navItem} onPress={() => { setTab(item.key); if (item.key !== 'more') setMorePage('menu'); }}><View style={[styles.navIconWrap, active && styles.navIconWrapActive]}><Text style={[styles.navIcon, active && styles.navIconActive]}>{item.icon}</Text></View><Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text></Pressable>;
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 16, paddingTop: 12, gap: 14 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  headerTextWrap: { alignItems: 'flex-end', flex: 1, marginLeft: 12 },
  pageTitle: { color: C.text, fontSize: 25, fontWeight: '800', textAlign: 'right' },
  pageSubtitle: { color: C.muted, fontSize: 12, marginTop: 4, textAlign: 'right' },
  circleButton: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, alignItems: 'center', justifyContent: 'center' },
  circleIcon: { color: C.text, fontSize: 21 }, notificationDot: { position: 'absolute', right: 8, top: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: C.red },
  avatar: { width: 42, height: 42, borderRadius: 14, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  card: { backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 20, padding: 16 },
  heroCard: { backgroundColor: '#122B5A', borderRadius: 24, padding: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#254781', alignItems: 'flex-end' },
  heroGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: '#5B8CFF33', left: -55, bottom: -90 }, heroGlow2: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: '#8D6BFF2F', right: -35, top: -55 },
  heroEyebrow: { color: '#AFC8FF', fontSize: 13 }, heroValue: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 10, letterSpacing: .5 }, heroCurrency: { color: '#CFDCFF', fontSize: 13, marginTop: 2 },
  heroBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 18, gap: 8 }, upBadge: { backgroundColor: '#2FD39A1F', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 }, upBadgeText: { color: C.green, fontWeight: '800', fontSize: 12 }, heroCompare: { color: '#AFC8FF', fontSize: 11 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }, kpiCard: { width: '48.4%', padding: 14 },
  kpiIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: '#182A45', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }, kpiIconPrimary: { backgroundColor: '#5B8CFF20' }, kpiIconText: { color: C.primary, fontSize: 18, fontWeight: '800' },
  kpiLabel: { color: C.muted, fontSize: 11, textAlign: 'right', marginTop: 10 }, kpiValue: { color: C.text, fontSize: 21, fontWeight: '800', textAlign: 'right', marginTop: 4 }, kpiDelta: { color: C.green, fontSize: 11, fontWeight: '700', textAlign: 'right', marginTop: 5 },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, sectionTitle: { color: C.text, fontWeight: '800', fontSize: 16 }, sectionAction: { color: C.primary, fontSize: 11, fontWeight: '700' },
  chartArea: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.border }, barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }, bar: { width: '52%', maxWidth: 18, borderRadius: 7, backgroundColor: C.primary }, chartLabel: { color: C.muted, fontSize: 8, height: 18, marginTop: 5 }, chartLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }, legendRight: { flexDirection: 'row', alignItems: 'center', gap: 6 }, legendDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary }, legendText: { color: C.muted, fontSize: 11 }, legendValue: { color: C.text, fontWeight: '700', fontSize: 12 },
  categoryList: { gap: 15 }, categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 14 }, categoryPercent: { color: C.text, fontSize: 12, width: 35 }, categoryMain: { flex: 1, gap: 6 }, categoryLabel: { color: C.muted, fontSize: 11, textAlign: 'right' }, progressTrack: { height: 7, borderRadius: 8, backgroundColor: '#17263D', overflow: 'hidden' }, progressFill: { height: '100%', backgroundColor: C.primary, borderRadius: 8, alignSelf: 'flex-end' },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, gap: 10 }, rowLeft: { alignItems: 'flex-start', gap: 5 }, rowDate: { color: C.muted, fontSize: 8 }, rowCenter: { flex: 1, alignItems: 'flex-end' }, rowTitle: { color: C.text, fontSize: 13, fontWeight: '700' }, rowSub: { color: C.muted, fontSize: 10, marginTop: 4 }, rowAvatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#182A45', alignItems: 'center', justifyContent: 'center' }, rowAvatarText: { color: '#AFC8FF', fontWeight: '900' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 }, statusText: { fontSize: 8.5, fontWeight: '800' },
  searchBox: { height: 50, borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, searchInput: { flex: 1, color: C.text, fontSize: 13 }, searchIcon: { color: C.muted, fontSize: 22, marginLeft: 8 },
  filterRow: { flexDirection: 'row-reverse', gap: 7, flexWrap: 'wrap' }, filterChip: { borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, paddingHorizontal: 10, paddingVertical: 7 }, filterChipActive: { borderColor: C.primary, backgroundColor: '#5B8CFF19' }, filterChipText: { color: C.muted, fontSize: 10 }, filterChipTextActive: { color: '#AFC8FF', fontWeight: '800' },
  productCard: { gap: 12 }, productTop: { flexDirection: 'row', alignItems: 'center', gap: 10 }, productTitleWrap: { flex: 1, alignItems: 'flex-end' }, productName: { color: C.text, fontSize: 14, fontWeight: '800' }, productCategory: { color: C.muted, fontSize: 10, marginTop: 4 }, productIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#182A45', alignItems: 'center', justifyContent: 'center' }, productIconText: { color: C.primary, fontSize: 22 }, stockBadge: { backgroundColor: '#2FD39A16', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 9 }, stockText: { color: C.green, fontSize: 9, fontWeight: '700' }, productDivider: { height: 1, backgroundColor: C.border }, productStats: { flexDirection: 'row', justifyContent: 'space-around' }, productStatLabel: { color: C.muted, fontSize: 9, textAlign: 'center' }, productStatValue: { color: C.text, fontSize: 11, fontWeight: '700', marginTop: 4, textAlign: 'center' },
  customerCard: { gap: 15 }, customerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }, customerMeta: { alignItems: 'flex-end', flex: 1 }, customerName: { color: C.text, fontWeight: '800', fontSize: 14 }, customerEmail: { color: C.muted, fontSize: 10, marginTop: 4 }, customerAvatar: { width: 46, height: 46, borderRadius: 16, backgroundColor: '#5B8CFF20', alignItems: 'center', justifyContent: 'center' }, customerAvatarText: { color: '#AFC8FF', fontSize: 17, fontWeight: '900' }, customerStats: { flexDirection: 'row', backgroundColor: '#091527', borderRadius: 14, padding: 11, alignItems: 'center' }, customerStat: { flex: 1, alignItems: 'center' }, customerStatDivider: { width: 1, height: 28, backgroundColor: C.border }, customerStatValue: { color: C.text, fontSize: 11, fontWeight: '800' }, customerStatLabel: { color: C.muted, fontSize: 9, marginTop: 4 },
  reportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, justifyContent: 'space-between' }, miniMetric: { width: '48.5%', borderRadius: 15, backgroundColor: '#0A1628', borderWidth: 1, borderColor: C.border, padding: 13 }, miniLabel: { color: C.muted, fontSize: 10, textAlign: 'right' }, miniValue: { color: C.text, fontWeight: '900', fontSize: 22, textAlign: 'right', marginTop: 7 }, miniDelta: { color: C.green, fontSize: 10, fontWeight: '700', textAlign: 'right', marginTop: 4 }, channelRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border, paddingVertical: 13 }, channelValue: { color: C.primary, fontWeight: '800' }, channelLabel: { color: C.text, fontSize: 12 },
  subHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 58 }, backIcon: { color: C.text, fontSize: 28, marginTop: -2 },
  aiHero: { borderRadius: 22, padding: 20, backgroundColor: '#182153', borderWidth: 1, borderColor: '#3B4381', alignItems: 'flex-end' }, aiIcon: { fontSize: 28, color: '#BFAFFF' }, aiHeroTitle: { color: C.text, fontSize: 20, fontWeight: '900', marginTop: 9 }, aiHeroText: { color: '#AAB6D8', fontSize: 11, lineHeight: 20, textAlign: 'right', marginTop: 7 }, insightCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' }, insightIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#7A63FF1D', alignItems: 'center', justifyContent: 'center' }, insightIconText: { color: '#BFAFFF', fontWeight: '900', fontSize: 17 }, insightBody: { flex: 1, alignItems: 'flex-end' }, insightTitle: { color: C.text, fontSize: 14, fontWeight: '800' }, insightText: { color: C.muted, fontSize: 11, lineHeight: 19, textAlign: 'right', marginTop: 5 }, inputLabel: { color: C.text, fontSize: 12, fontWeight: '800', textAlign: 'right', marginTop: 4 }, aiInputWrap: { flexDirection: 'row', backgroundColor: C.panel, borderWidth: 1, borderColor: C.border, borderRadius: 17, padding: 7, alignItems: 'center' }, aiInput: { flex: 1, color: C.text, fontSize: 12, paddingHorizontal: 8 }, sendButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, sendButtonText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  profileCard: { alignItems: 'center' }, bigAvatar: { width: 72, height: 72, borderRadius: 24, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, bigAvatarText: { color: '#fff', fontSize: 22, fontWeight: '900' }, profileName: { color: C.text, fontWeight: '900', fontSize: 18, marginTop: 12 }, profileEmail: { color: C.muted, fontSize: 11, marginTop: 4 }, settingRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.border }, settingRight: { minWidth: 42, alignItems: 'flex-start' }, settingText: { flex: 1, alignItems: 'flex-end', marginLeft: 12 }, settingTitle: { color: C.text, fontSize: 13, fontWeight: '700' }, settingSub: { color: C.muted, fontSize: 9.5, marginTop: 4, textAlign: 'right' }, chevron: { color: C.muted, fontSize: 25 }, versionBadge: { color: C.primary, fontSize: 12, fontWeight: '900' },
  brandCard: { flexDirection: 'row', alignItems: 'center', gap: 12 }, brandLogo: { width: 52, height: 52, borderRadius: 17, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }, brandLogoText: { color: '#fff', fontWeight: '900', fontSize: 22 }, brandTitle: { color: C.text, fontSize: 16, fontWeight: '900' }, brandSub: { color: C.muted, fontSize: 10, marginTop: 4 }, menuCard: { minHeight: 78, borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }, menuChevron: { color: C.muted, fontSize: 25 }, menuText: { flex: 1, alignItems: 'flex-end' }, menuTitle: { color: C.text, fontSize: 14, fontWeight: '800' }, menuDesc: { color: C.muted, fontSize: 10, marginTop: 4 }, menuIcon: { width: 45, height: 45, borderRadius: 14, backgroundColor: '#182A45', alignItems: 'center', justifyContent: 'center' }, menuIconText: { color: C.primary, fontSize: 19, fontWeight: '800' },
  bottomNav: { position: 'absolute', left: 10, right: 10, bottom: Platform.OS === 'ios' ? 10 : 8, height: 70, backgroundColor: '#0B1728F5', borderRadius: 22, borderWidth: 1, borderColor: C.border, flexDirection: 'row', paddingHorizontal: 6, paddingTop: 7, paddingBottom: 5, shadowColor: '#000', shadowOpacity: .28, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 14 }, navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' }, navIconWrap: { height: 28, minWidth: 36, paddingHorizontal: 7, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, navIconWrapActive: { backgroundColor: '#5B8CFF20' }, navIcon: { color: C.muted, fontSize: 16, fontWeight: '700' }, navIconActive: { color: C.primary }, navLabel: { color: C.muted, fontSize: 8.5, marginTop: 3 }, navLabelActive: { color: '#AFC8FF', fontWeight: '800' },
  loginRoot: { flex: 1, backgroundColor: C.bg }, loginSafe: { flex: 1 }, loginContent: { flexGrow: 1, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center', paddingVertical: 36 }, loginLogo: { width: 78, height: 78, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOpacity: .25, shadowRadius: 25, elevation: 8 }, loginLogoText: { color: '#fff', fontSize: 31, fontWeight: '900' }, loginTitle: { color: C.text, fontSize: 28, fontWeight: '900', marginTop: 18 }, loginSub: { color: C.muted, fontSize: 12, marginTop: 7 }, loginForm: { width: '100%', marginTop: 36 }, loginInputLabel: { color: C.text, textAlign: 'right', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 12 }, textInput: { width: '100%', height: 52, borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.panel, color: C.text, paddingHorizontal: 14 }, loginButton: { height: 52, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 22 }, loginButtonText: { color: '#fff', fontSize: 14, fontWeight: '900' }, demoButton: { height: 48, borderRadius: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 }, demoButtonText: { color: '#AFC8FF', fontSize: 12, fontWeight: '700' }, loginFoot: { color: C.muted, fontSize: 9, textAlign: 'center', marginTop: 20, maxWidth: Dimensions.get('window').width - 50 },
});
