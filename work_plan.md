# 🗺️ תכנית עבודה — צד לקוח (Client-Side Assignment)

> **בסיס:** React + TypeScript + Vite | Redux Toolkit | React Query | React Router v7  
> **מתואם עם:** שרת Express/Node.js + MongoDB (server-side-assignment-benny161299)

---

## 📊 סקירת מצב נוכחי

### ✅ מה קיים וסגור

| קטגוריה | קבצים | מצב |
|---|---|---|
| **תשתית** | `main.tsx` — Provider, QueryClient, BrowserRouter, ToastContainer | ✅ מלא |
| **API Layer** | `client.ts`, `items.api.ts`, `suppliers.api.ts`, `orders.api.ts`, `analysis.api.ts` | ✅ מלא, מתואם עם שרת |
| **Interfaces** | `interfaces/index.ts` — IItem, ISupplier, IOrder, כל ה-Analysis types | ✅ מתואם עם מודלים בשרת |
| **Redux Store** | `store/index.ts`, `cartSlice.ts`, `hooks.ts` — לוגיקת עגלה + validation | ✅ מלא |
| **Hooks** | `useItems`, `useSuppliers`, `useOrders`, `useAnalysis` | ✅ מלא |
| **עמוד בית** | `HomePage.tsx` — grid, search עם debounce, filter | ✅ מלא |
| **עמוד פרטים** | `DetailsPage.tsx` — תצוגה, הוסף לעגלה, qty | ✅ מלא |
| **עמוד עגלה** | `CartPage.tsx` — CRUD, checkout, recommendations | ✅ מלא |
| **Navbar** | `Navbar.tsx` + CSS | ✅ קיים |
| **ProductCard** | `ProductCard.tsx` + CSS | ✅ קיים |
| **FilterBar** | `FilterBar.tsx` + CSS — category, supplier, price, sort | ✅ קיים |

### ❌ מה חסר / לא מושלם

| קטגוריה | בעיה | עדיפות |
|---|---|---|
| **AdminPage** | קובץ ריק לחלוטין — placeholder בלבד | 🔴 קריטי |
| **Analysis Dashboard** | כל 6 endpoints קיימים בשרת, hook קיים, אבל אין UI | 🔴 קריטי |
| **shopProfit בהזמנה** | מחושב כ-`price * qty` בלבד — שגוי, צריך `(price - supplierPrice) * qty` אך אין supplierPrice בצד לקוח | 🟡 בינוני |
| **Error Handling** | Axios errors אינם מועברים בצורה ידידותית למשתמש | 🟡 בינוני |
| **הגנת stock ב-updateQuantity** | `CartPage` אינו בודק stock כשמוסיפים כמות | 🟡 בינוני |
| **Cart persistence** | רענון הדפדפן מוחק את העגלה (אין localStorage) | 🟢 נוחות |
| **Navbar — cart count** | לא ידוע אם מוצג badge עם מספר פריטים בעגלה | 🟢 נוחות |
| **Responsive design** | לא נבדק על mobile | 🟢 נוחות |

---

## 📋 תכנית עבודה לפי שלבים

---

### שלב 1 — AdminPage: ממשק ניהול מלא 🔴

> **מה:** בניית ה-AdminPage מאפס — המקום לנהל Items, Suppliers, Analysis  
> **למה עכשיו:** הקובץ ריק לחלוטין ומייצג את החלק הגדול ביותר שחסר

#### 1A — ניהול פריטים (Items CRUD)
- [ ] טבלה/רשימה של כל הפריטים (`useItems`)
- [ ] כפתור **צור פריט** → modal/form עם שדות: `name, price, stock, category, supplier (dropdown), image?, description?`
  - ה-`supplier` dropdown ייטען מ-`useSuppliers`
  - validation: שם חייב להיות זהה לשם פריט אצל הספק (`supplier.items[].itemName`)
- [ ] כפתור **ערוך** לכל שורה → פתח form מאוכלס
- [ ] כפתור **מחק** לכל שורה → confirm dialog → `useDeleteItem`
- [ ] הצגת הודעות הצלחה/שגיאה עם `toast`

#### 1B — ניהול ספקים (Suppliers CRUD)
- [ ] טבלה של כל הספקים (`useSuppliers`)
- [ ] צור ספק חדש (שם בלבד) → `useCreateSupplier`
- [ ] מחק ספק → `useDeleteSupplier` (cascade מוסבר — יימחקו פריטים קשורים)
- [ ] הוסף פריט לספק → `useAddItemToSupplier` (itemName, supplierPrice)
- [ ] הסר פריט מספק → `useRemoveItemFromSupplier`

---

### שלב 2 — Analysis Dashboard 🔴

> **מה:** ממשק ויזואלי לכל 6 endpoints ה-analysis של השרת  
> **קיים:** כל ה-hooks וה-API calls מוכנים, חסר רק UI

כל ה-hooks קיימים, רק צריך להציג:

| Hook | נתון | תצוגה מוצעת |
|---|---|---|
| `useMonthlyRevenue` | `revenue: number` | כרטיס עם סכום + אייקון 💰 |
| `useWeeklyTopCategory` | `category, profit` | כרטיס עם שם קטגוריה + רווח 📊 |
| `useDailyTopItem` | `name, profit` | כרטיס עם שם פריט + רווח 🏆 |
| `useProfitMargins` | `highest / lowest` | 2 כרטיסים זה לצד זה ↑↓ |
| `useTopSupplier` | `name, profit` | כרטיס ספק מוביל 🥇 |
| `useSupplierSpend` | `[{name, totalSpent}]` | טבלה ממוינת ↓ |

- [ ] צור קומפוננט `AnalysisDashboard.tsx` (תחת `components/`)
- [ ] שלב אותו בתוך `AdminPage` כ-tab נפרד (tabs: "פריטים" | "ספקים" | "אנליטיקה")
- [ ] טיפול ב-loading/error states לכל query

---

### שלב 3 — תיקוני bugs ואיכות קוד 🟡

#### 3A — shopProfit בהזמנה
```tsx
// CartPage.tsx — כרגע שגוי:
const shopProfit = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

// הבעיה: ShopProfit = (retailPrice - supplierPrice) * qty
// הפתרון המומלץ: שלח 0 מהלקוח, תן לשרת לחשב
```
- [ ] שנה את ה-payload כך שישלח `shopProfit: 0`  
- [ ] וודא שהשרת מחשב את הרווח בפועל מתוך `supplier.items[].supplierPrice`
- [ ] בדוק `order.service.ts` בצד שרת

#### 3B — Axios Error Interceptor
- [ ] הוסף ל-`api/client.ts` interceptor שמחלץ `response.data.message` מ-Axios errors:
```ts
apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err.response?.data?.message ?? err.message;
    return Promise.reject(new Error(msg));
  }
);
```

#### 3C — updateQuantity + stock check
- [ ] ב-`cartSlice.ts` — `updateQuantity` כבר בודק stock, אך `CartPage` לא עושה re-fetch של פריטים.  
  מומלץ להוסיף `useQueryClient().invalidateQueries(['items'])` לאחר checkout.

---

### שלב 4 — UX Improvements 🟢

#### 4A — Cart Persistence (localStorage)
- [ ] הוסף ל-`store/index.ts` middleware של `localStorage`:
```ts
store.subscribe(() => {
  localStorage.setItem('cart', JSON.stringify(store.getState().cart.items));
});
```
- [ ] טען מ-`localStorage` ב-`initialState` של `cartSlice`

#### 4B — Navbar Cart Badge
- [ ] ב-`Navbar.tsx` — הצג מספר פריטים/כמות כוללת בעגלה באמצעות `useAppSelector`
- [ ] הוסף אנימציה קטנה כשמוסיפים פריט

#### 4C — Loading Skeletons
- [ ] ב-`HomePage` — החלף `<p>טוען...</p>` ב-skeleton cards
- [ ] ב-`DetailsPage` — skeleton בזמן טעינת פרטי פריט

#### 4D — Empty States
- [ ] עמוד ריק יפה עם CTA כשאין פריטים / אין תוצאות חיפוש

---

### שלב 5 — Testing & Cleanup 🟢

- [ ] בדיקת TypeScript: `npm run build` ← 0 errors
- [ ] בדיקת ESLint: `npm run lint` ← 0 warnings
- [ ] בדיקת integration: הרץ שרת + לקוח, בצע flow מלא:
  1. צור ספק → הוסף פריט לספק → צור store item
  2. חפש פריט, הוסף לעגלה, שנה כמות, בצע הזמנה
  3. בדוק שה-stock ירד בשרת
  4. כנס ל-analysis dashboard — ודא שהנתונים מתעדכנים
- [ ] נקה `console.log` שנשארו

---

## 🔗 מיפוי Server ↔ Client API

| Server Route | Client API | Hook |
|---|---|---|
| `GET /items` | `fetchAllItems` | `useItems` |
| `GET /items/:id` | `fetchItemById` | `useItem` |
| `GET /items/search` | `searchItems` | `useSearchItems` |
| `POST /items` | `createItem` | `useCreateItem` |
| `PUT /items/:id` | `updateItem` | `useUpdateItem` |
| `DELETE /items/:id` | `deleteItem` | `useDeleteItem` |
| `GET /suppliers` | `fetchAllSuppliers` | `useSuppliers` |
| `GET /suppliers/:id` | `fetchSupplierById` | `useSupplier` |
| `POST /suppliers` | `createSupplier` | `useCreateSupplier` |
| `DELETE /suppliers/:id` | `deleteSupplier` | `useDeleteSupplier` |
| `POST /suppliers/:id/items` | `addItemToSupplier` | `useAddItemToSupplier` |
| `DELETE /suppliers/:id/items` | `removeItemFromSupplier` | `useRemoveItemFromSupplier` |
| `POST /orders` | `createOrder` | `useCreateOrder` |
| `GET /orders` | `fetchAllOrders` | — |
| `GET /analysis/monthly-revenue` | `getMonthlyRevenue` | `useMonthlyRevenue` |
| `GET /analysis/weekly-top-category` | `getWeeklyTopCategory` | `useWeeklyTopCategory` |
| `GET /analysis/daily-top-item` | `getDailyTopItem` | `useDailyTopItem` |
| `GET /analysis/profit-margins` | `getProfitMargins` | `useProfitMargins` |
| `GET /analysis/top-supplier` | `getTopSupplier` | `useTopSupplier` |
| `GET /analysis/supplier-spend` | `getSupplierSpend` | `useSupplierSpend` |

> [!NOTE]
> כל הנתיבים מתחילים ב-`/api` — מוגדר ב-`client.ts` דרך `VITE_API_URL`

---

## ⚡ סדר ביצוע מומלץ

```
שלב 1A (Items CRUD בAdmin) 
    ↓
שלב 1B (Suppliers CRUD בAdmin)
    ↓
שלב 2 (Analysis Dashboard)
    ↓
שלב 3A + 3B (תיקוני bugs)
    ↓
שלב 4A + 4B (Cart persistence + Navbar badge)
    ↓
שלב 5 (Testing + Cleanup)
```

> [!IMPORTANT]
> שלבים 1 ו-2 הם **קריטיים** ומייצגים את רוב העבודה החסרה.  
> שלבים 3-4 הם שיפורים שיגדילו את הציון אך האפליקציה תעבוד גם בלעדיהם.

---

## 📁 קבצים שייווצרו בתהליך

```
src/
├── pages/
│   └── AdminPage.tsx          ← יבנה מחדש (כרגע ריק)
├── components/
│   ├── AnalysisDashboard.tsx  ← חדש
│   ├── ItemForm.tsx            ← חדש (modal/form)
│   └── SupplierForm.tsx        ← חדש (modal/form)
```
