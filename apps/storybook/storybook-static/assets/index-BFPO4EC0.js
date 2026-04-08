import { r as l, R as k } from './iframe-BQjLC8sM.js';
var N = { exports: {} },
  y = {};
var h;
function P() {
  if (h) return y;
  h = 1;
  var e = Symbol.for('react.transitional.element'),
    r = Symbol.for('react.fragment');
  function a(s, t, i) {
    var d = null;
    if ((i !== void 0 && (d = '' + i), t.key !== void 0 && (d = '' + t.key), 'key' in t)) {
      i = {};
      for (var u in t) u !== 'key' && (i[u] = t[u]);
    } else i = t;
    return ((t = i.ref), { $$typeof: e, type: s, key: d, ref: t !== void 0 ? t : null, props: i });
  }
  return ((y.Fragment = r), (y.jsx = a), (y.jsxs = a), y);
}
var j;
function I() {
  return (j || ((j = 1), (N.exports = P())), N.exports);
}
var n = I();
function R(e, r) {
  if (typeof e == 'function') return e(r);
  e != null && (e.current = r);
}
function $(...e) {
  return (r) => {
    let a = !1;
    const s = e.map((t) => {
      const i = R(t, r);
      return (!a && typeof i == 'function' && (a = !0), i);
    });
    if (a)
      return () => {
        for (let t = 0; t < s.length; t++) {
          const i = s[t];
          typeof i == 'function' ? i() : R(e[t], null);
        }
      };
  };
}
var B = Symbol.for('react.lazy'),
  z = k[' use '.trim().toString()];
function T(e) {
  return typeof e == 'object' && e !== null && 'then' in e;
}
function S(e) {
  return (
    e != null &&
    typeof e == 'object' &&
    '$$typeof' in e &&
    e.$$typeof === B &&
    '_payload' in e &&
    T(e._payload)
  );
}
function L(e) {
  const r = H(e),
    a = l.forwardRef((s, t) => {
      let { children: i, ...d } = s;
      S(i) && typeof z == 'function' && (i = z(i._payload));
      const u = l.Children.toArray(i),
        m = u.find(W);
      if (m) {
        const c = m.props.children,
          p = u.map((f) =>
            f === m
              ? l.Children.count(c) > 1
                ? l.Children.only(null)
                : l.isValidElement(c)
                  ? c.props.children
                  : null
              : f,
          );
        return n.jsx(r, {
          ...d,
          ref: t,
          children: l.isValidElement(c) ? l.cloneElement(c, void 0, p) : null,
        });
      }
      return n.jsx(r, { ...d, ref: t, children: i });
    });
  return ((a.displayName = `${e}.Slot`), a);
}
var O = L('Slot');
function H(e) {
  const r = l.forwardRef((a, s) => {
    let { children: t, ...i } = a;
    if ((S(t) && typeof z == 'function' && (t = z(t._payload)), l.isValidElement(t))) {
      const d = q(t),
        u = J(i, t.props);
      return (t.type !== l.Fragment && (u.ref = s ? $(s, d) : d), l.cloneElement(t, u));
    }
    return l.Children.count(t) > 1 ? l.Children.only(null) : null;
  });
  return ((r.displayName = `${e}.SlotClone`), r);
}
var F = Symbol('radix.slottable');
function W(e) {
  return (
    l.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === F
  );
}
function J(e, r) {
  const a = { ...r };
  for (const s in r) {
    const t = e[s],
      i = r[s];
    /^on[A-Z]/.test(s)
      ? t && i
        ? (a[s] = (...u) => {
            const m = i(...u);
            return (t(...u), m);
          })
        : t && (a[s] = t)
      : s === 'style'
        ? (a[s] = { ...t, ...i })
        : s === 'className' && (a[s] = [t, i].filter(Boolean).join(' '));
  }
  return { ...e, ...a };
}
function q(e) {
  let r = Object.getOwnPropertyDescriptor(e.props, 'ref')?.get,
    a = r && 'isReactWarning' in r && r.isReactWarning;
  return a
    ? e.ref
    : ((r = Object.getOwnPropertyDescriptor(e, 'ref')?.get),
      (a = r && 'isReactWarning' in r && r.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
function A(e) {
  var r,
    a,
    s = '';
  if (typeof e == 'string' || typeof e == 'number') s += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var t = e.length;
      for (r = 0; r < t; r++) e[r] && (a = A(e[r])) && (s && (s += ' '), (s += a));
    } else for (a in e) e[a] && (s && (s += ' '), (s += a));
  return s;
}
function w() {
  for (var e, r, a = 0, s = '', t = arguments.length; a < t; a++)
    (e = arguments[a]) && (r = A(e)) && (s && (s += ' '), (s += r));
  return s;
}
const C = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
  g = w,
  _ = (e, r) => (a) => {
    var s;
    if (r?.variants == null) return g(e, a?.class, a?.className);
    const { variants: t, defaultVariants: i } = r,
      d = Object.keys(t).map((c) => {
        const p = a?.[c],
          f = i?.[c];
        if (p === null) return null;
        const v = C(p) || C(f);
        return t[c][v];
      }),
      u =
        a &&
        Object.entries(a).reduce((c, p) => {
          let [f, v] = p;
          return (v === void 0 || (c[f] = v), c);
        }, {}),
      m =
        r == null || (s = r.compoundVariants) === null || s === void 0
          ? void 0
          : s.reduce((c, p) => {
              let { class: f, className: v, ...E } = p;
              return Object.entries(E).every((V) => {
                let [b, x] = V;
                return Array.isArray(x) ? x.includes({ ...i, ...u }[b]) : { ...i, ...u }[b] === x;
              })
                ? [...c, f, v]
                : c;
            }, []);
    return g(e, d, m, a?.class, a?.className);
  };
function o(...e) {
  return w(e);
}
var G = _('mizu-button', {
    variants: {
      variant: {
        primary: 'mizu-button--primary',
        secondary: 'mizu-button--secondary',
        ghost: 'mizu-button--ghost',
        destructive: 'mizu-button--destructive',
      },
      size: {
        sm: 'mizu-button--sm',
        md: 'mizu-button--md',
        lg: 'mizu-button--lg',
        icon: 'mizu-button--icon',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }),
  Y = l.forwardRef(
    (
      {
        className: e,
        variant: r,
        size: a,
        asChild: s = !1,
        loading: t = !1,
        disabled: i,
        children: d,
        ...u
      },
      m,
    ) => {
      const c = s ? O : 'button';
      return n.jsxs(c, {
        ref: m,
        className: o(G({ variant: r, size: a, className: e })),
        'data-loading': t || void 0,
        'aria-busy': t || void 0,
        disabled: i ?? t,
        ...u,
        children: [
          n.jsx('span', { className: 'mizu-button__label', children: d }),
          t && n.jsx('span', { className: 'mizu-button__spinner', 'aria-hidden': 'true' }),
        ],
      });
    },
  );
Y.displayName = 'Button';
var D = _('mizu-badge', {
    variants: {
      tone: {
        neutral: 'mizu-badge--neutral',
        success: 'mizu-badge--success',
        warning: 'mizu-badge--warning',
        danger: 'mizu-badge--danger',
        info: 'mizu-badge--info',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }),
  M = l.forwardRef(({ className: e, tone: r, dot: a, children: s, ...t }, i) =>
    n.jsxs('span', {
      ref: i,
      className: o(D({ tone: r, className: e })),
      ...t,
      children: [a && n.jsx('span', { className: 'mizu-badge__dot', 'aria-hidden': 'true' }), s],
    }),
  );
M.displayName = 'Badge';
var Z = l.forwardRef(({ className: e, interactive: r, ...a }, s) =>
  n.jsx('div', { ref: s, className: o('mizu-card', r && 'mizu-card--interactive', e), ...a }),
);
Z.displayName = 'Card';
var U = l.forwardRef(({ className: e, title: r, description: a, children: s, ...t }, i) =>
  n.jsxs('div', {
    ref: i,
    className: o('mizu-card__header', e),
    ...t,
    children: [
      r && n.jsx('h3', { className: 'mizu-card__title', children: r }),
      a && n.jsx('p', { className: 'mizu-card__description', children: a }),
      s,
    ],
  }),
);
U.displayName = 'CardHeader';
var Q = l.forwardRef(({ className: e, ...r }, a) =>
  n.jsx('div', { ref: a, className: o('mizu-card__body', e), ...r }),
);
Q.displayName = 'CardBody';
var X = l.forwardRef(({ className: e, ...r }, a) =>
  n.jsx('div', { ref: a, className: o('mizu-card__footer', e), ...r }),
);
X.displayName = 'CardFooter';
var K = _('mizu-input', {
    variants: { size: { sm: 'mizu-input--sm', md: '', lg: 'mizu-input--lg' } },
    defaultVariants: { size: 'md' },
  }),
  ee = l.forwardRef(({ className: e, size: r, type: a = 'text', ...s }, t) =>
    n.jsx('input', { ref: t, type: a, className: o(K({ size: r, className: e })), ...s }),
  );
ee.displayName = 'Input';
var ae = l.forwardRef(({ className: e, icon: r, title: a, description: s, actions: t, ...i }, d) =>
  n.jsxs('div', {
    ref: d,
    className: o('mizu-empty-state', e),
    ...i,
    children: [
      r &&
        n.jsx('div', { className: 'mizu-empty-state__icon', 'aria-hidden': 'true', children: r }),
      n.jsx('h2', { className: 'mizu-empty-state__title', children: a }),
      s && n.jsx('p', { className: 'mizu-empty-state__description', children: s }),
      t && n.jsx('div', { className: 'mizu-empty-state__actions', children: t }),
    ],
  }),
);
ae.displayName = 'EmptyState';
var re = l.forwardRef(({ className: e, gap: r, align: a, style: s, as: t = 'div', ...i }, d) => {
  const u = t;
  return n.jsx(u, {
    ref: d,
    className: o('mizu-stack', a && `mizu-stack--align-${a}`, e),
    style: { ...(r && { '--mizu-stack-gap': r }), ...s },
    ...i,
  });
});
re.displayName = 'Stack';
var te = l.forwardRef(({ className: e, gap: r, align: a, style: s, ...t }, i) =>
  n.jsx('div', {
    ref: i,
    className: o('mizu-inline', a && `mizu-inline--align-${a}`, e),
    style: { ...(r && { '--mizu-inline-gap': r }), ...s },
    ...t,
  }),
);
te.displayName = 'Inline';
var se = l.forwardRef(({ className: e, gap: r, min: a, style: s, ...t }, i) =>
  n.jsx('div', {
    ref: i,
    className: o('mizu-grid', e),
    style: { ...(r && { '--mizu-grid-gap': r }), ...(a && { '--mizu-grid-min': a }), ...s },
    ...t,
  }),
);
se.displayName = 'Grid';
var ie = l.forwardRef(({ className: e, gap: r, fraction: a, style: s, ...t }, i) =>
  n.jsx('div', {
    ref: i,
    className: o('mizu-split', e),
    style: { ...(r && { '--mizu-split-gap': r }), ...(a && { '--mizu-split-fraction': a }), ...s },
    ...t,
  }),
);
ie.displayName = 'Split';
var ne = l.forwardRef(({ className: e, max: r, padding: a, column: s, style: t, ...i }, d) =>
  n.jsx('div', {
    ref: d,
    className: o('mizu-center', s && 'mizu-center--column', e),
    style: { ...(r && { '--mizu-center-max': r }), ...(a && { '--mizu-center-padding': a }), ...t },
    ...i,
  }),
);
ne.displayName = 'Center';
var le = l.forwardRef(({ className: e, gap: r, justify: a, style: s, ...t }, i) =>
  n.jsx('div', {
    ref: i,
    className: o('mizu-cluster', e),
    style: {
      ...(r && { '--mizu-cluster-gap': r }),
      ...(a && { '--mizu-cluster-justify': a }),
      ...s,
    },
    ...t,
  }),
);
le.displayName = 'Cluster';
var de = l.createContext(null),
  oe = l.forwardRef(
    (
      { className: e, defaultSidebarCollapsed: r = !1, sidebarHidden: a = !1, children: s, ...t },
      i,
    ) => {
      const [d, u] = l.useState(r),
        m = l.useMemo(() => ({ sidebarCollapsed: d, setSidebarCollapsed: u }), [d]);
      return n.jsx(de.Provider, {
        value: m,
        children: n.jsx('div', {
          ref: i,
          className: o('mizu-app-layout', e),
          'data-sidebar-collapsed': d || void 0,
          'data-sidebar-hidden': a || void 0,
          ...t,
          children: s,
        }),
      });
    },
  );
oe.displayName = 'AppLayout';
var ue = l.forwardRef(({ className: e, brand: r, nav: a, actions: s, children: t, ...i }, d) =>
  n.jsxs('header', {
    ref: d,
    className: o('mizu-app-header', e),
    ...i,
    children: [
      r && n.jsx('div', { className: 'mizu-app-header__brand', children: r }),
      a && n.jsx('nav', { className: 'mizu-app-header__nav', children: a }),
      n.jsx('div', { className: 'mizu-app-header__spacer' }),
      s && n.jsx('div', { className: 'mizu-app-header__actions', children: s }),
      t,
    ],
  }),
);
ue.displayName = 'AppHeader';
var ce = l.forwardRef(({ className: e, ariaLabel: r = 'Primary', children: a, ...s }, t) =>
  n.jsx('aside', {
    ref: t,
    className: o('mizu-app-sidebar', e),
    'aria-label': r,
    ...s,
    children: a,
  }),
);
ce.displayName = 'AppSidebar';
var me = l.forwardRef(({ className: e, label: r, children: a, ...s }, t) =>
  n.jsxs('div', {
    ref: t,
    className: o('mizu-app-sidebar__section', e),
    ...s,
    children: [r && n.jsx('div', { className: 'mizu-app-sidebar__section-label', children: r }), a],
  }),
);
me.displayName = 'AppSidebarSection';
var pe = l.forwardRef(({ className: e, icon: r, active: a, children: s, ...t }, i) =>
  n.jsxs('a', {
    ref: i,
    className: o('mizu-app-sidebar__item', e),
    'aria-current': a ? 'page' : void 0,
    ...t,
    children: [
      r && n.jsx('span', { className: 'mizu-app-sidebar__item-icon', children: r }),
      n.jsx('span', { className: 'mizu-app-sidebar__item-label', children: s }),
    ],
  }),
);
pe.displayName = 'AppSidebarItem';
var fe = l.forwardRef(({ className: e, contentType: r = 'default', children: a, ...s }, t) =>
  n.jsx('main', {
    ref: t,
    className: o('mizu-app-content', e),
    'data-content-type': r,
    ...s,
    children: a,
  }),
);
fe.displayName = 'AppContent';
var ve = l.forwardRef(
  ({ className: e, title: r, description: a, actions: s, children: t, ...i }, d) =>
    n.jsxs('div', {
      ref: d,
      className: o('mizu-app-content__header', e),
      ...i,
      children: [
        n.jsxs('div', {
          style: { display: 'flex', alignItems: 'flex-start', gap: '1rem' },
          children: [
            n.jsxs('div', {
              style: { flex: 1 },
              children: [
                n.jsx('h1', { className: 'mizu-app-content__title', children: r }),
                a && n.jsx('p', { className: 'mizu-app-content__description', children: a }),
              ],
            }),
            s,
          ],
        }),
        t,
      ],
    }),
);
ve.displayName = 'AppContentHeader';
var ye = l.forwardRef(({ className: e, items: r, ...a }, s) =>
  n.jsx('nav', {
    ref: s,
    'aria-label': 'Breadcrumb',
    ...a,
    children: n.jsx('ol', {
      className: o('mizu-app-breadcrumbs', e),
      children: r.map((t, i) => {
        const d = i === r.length - 1;
        return n.jsx(
          'li',
          {
            className: 'mizu-app-breadcrumbs__item',
            'aria-current': d ? 'page' : void 0,
            children:
              d || !t.href
                ? t.label
                : n.jsx('a', {
                    className: 'mizu-app-breadcrumbs__link',
                    href: t.href,
                    children: t.label,
                  }),
          },
          `${t.label}-${i}`,
        );
      }),
    }),
  }),
);
ye.displayName = 'AppBreadcrumbs';
export {
  oe as A,
  Y as B,
  Z as C,
  ae as E,
  se as G,
  ee as I,
  re as S,
  ue as a,
  ce as b,
  me as c,
  pe as d,
  fe as e,
  ye as f,
  ve as g,
  U as h,
  te as i,
  n as j,
  M as k,
  Q as l,
  X as m,
};
