import { useMemo, useState } from 'react'
import { ChevronDown, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react'
import './Cart.css'

const menuSections = [
  {
    name: 'Signature Subs',
    groups: [
      { name: 'Veg Subs', veg: true, items: [
        ['Veggie Delite', 'Fresh vegetables with your choice of sauce', 119, 219],
        ['Aloo Patty', 'Spiced potato patty and fresh vegetables', 140, 250],
        ['Corn & Peas', 'Sweet corn and green peas with creamy sauce', 140, 250],
        ['Chilli Bean Patty', 'Spiced bean patty with crisp vegetables', 150, 260],
        ['Paneer Tikka', 'Tandoori paneer, vegetables and signature sauce', 229, 399],
      ] },
      { name: 'Non-Veg Subs', veg: false, items: [
        ['Double Egg & Cheese Omelette', 'Double egg omelette finished with cheese', 199, 349],
        ['Spicy Chicken Keema', 'Indian-style chicken keema and vegetables', 240, 420],
        ['Chicken Slice', 'Tender chicken slices with fresh vegetables', 229, 399],
        ['Chicken Teriyaki', 'Sweet teriyaki chicken and crisp vegetables', 229, 399],
        ['Chicken Meatball', 'Seasoned chicken meatballs and signature sauce', 229, 399],
        ['Roast Chicken', 'Slow-roasted chicken and garden vegetables', 229, 399],
        ['Peri Peri Chicken', 'Peri peri chicken with fresh vegetables', 229, 399],
        ['Tandoori Chicken', 'Tandoori chicken with vegetables and sauce', 229, 399],
        ['Tuna', 'Tuna with vegetables and your choice of sauce', 229, 399],
        ['Italian B.M.T. (Chicken)', 'Chicken, cheese and classic Italian flavours', 240, 420],
        ['Italian B.M.T. (Lamb)', 'Lamb, cheese and classic Italian flavours', 249, 449],
        ['Lamb Pepperoni', 'Lamb pepperoni with vegetables and cheese', 249, 449],
      ] },
    ],
  },
  {
    name: 'Sub Cravers',
    groups: [
      { name: 'Veg Cravers', veg: true, items: [
        ['Classic Veg', 'Fresh vegetables with your choice of sauce', 79, 149],
        ['Tandoori Paneer', 'Tandoori paneer with vegetables and sauce', 229, 399],
      ] },
      { name: 'Non-Veg Cravers', veg: false, items: [
        ['Classic Chicken', 'Chicken, fresh vegetables and signature sauce', 119, 229],
        ['Spicy Chicken Seekh', 'Spiced chicken seekh with fresh vegetables', 209, 379],
      ] },
    ],
  },
  {
    name: 'Salads & Wraps',
    groups: [
      { name: 'Signature Wraps — Veg', veg: true, items: [
        ['Veggie Delite Wrap', 'Fresh vegetables wrapped with your choice of sauce', 199, 199],
        ['Paneer Tikka Wrap', 'Paneer tikka and vegetables wrapped fresh', 229, 229],
      ] },
      { name: 'Signature Wraps — Non-Veg', veg: false, items: [
        ['Chicken Tikka Wrap', 'Chicken tikka, vegetables and signature sauce', 229, 229],
        ['Chicken Keema Wrap', 'Chicken keema wrapped with vegetables and sauce', 240, 240],
        ['Chicken Seekh Wrap', 'Chicken seekh with vegetables and sauce', 209, 209],
      ] },
      { name: 'Signature Salads — Veg', veg: true, items: [
        ['Veggie Delite Salad', 'Fresh garden vegetables served as a salad', 199, 199],
        ['Paneer Tikka Salad', 'Paneer tikka, vegetables and signature sauce', 239, 239],
      ] },
      { name: 'Signature Salads — Non-Veg', veg: false, items: [
        ['Chicken Tikka Salad', 'Chicken tikka with vegetables and sauce', 229, 229],
        ['Chicken Keema Salad', 'Chicken keema with vegetables and sauce', 240, 240],
        ['Chicken Seekh Salad', 'Chicken seekh served with fresh vegetables', 209, 209],
      ] },
    ],
  },
]

export default function SubwayMenu() {
  const [active, setActive] = useState('Signature Subs')
  const [search, setSearch] = useState('')
  const [dietFilter, setDietFilter] = useState('all')
  const [service, setService] = useState('Dine In')
  const [serviceOpen, setServiceOpen] = useState(false)
  const [cart, setCart] = useState({})
  const [showAll, setShowAll] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [payment, setPayment] = useState('UPI')
  const [upiApp, setUpiApp] = useState('Paytm')
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' })

  const filteredSections = useMemo(() => {
    const sections = showAll ? menuSections : menuSections.filter((section) => section.name === active)
    return sections.map((section) => ({
      ...section,
      groups: section.groups.map((group) => ({
        ...group,
        items: group.items.filter(([name, description]) => {
          if (dietFilter === 'veg' && !group.veg) return false
          if (dietFilter === 'nonveg' && group.veg) return false
          if (!search.trim()) return true
          const query = search.toLowerCase()
          return name.toLowerCase().includes(query) || description.toLowerCase().includes(query)
        }),
      })).filter((group) => group.items.length > 0),
    })).filter((section) => section.groups.length > 0)
  }, [active, search, dietFilter, showAll])

  const findItem = (cartKey) => {
    const [name, size] = cartKey.split('||')
    const item = menuSections.flatMap((section) => section.groups).flatMap((group) => group.items).find((entry) => entry[0] === name)
    if (!item) return 0
    return size === '12 inch' ? item[3] : item[2]
  }
  const cartCount = Object.values(cart).reduce((sum, value) => sum + value, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [cartKey, quantity]) => sum + findItem(cartKey) * quantity, 0)
  const add = (cartKey) => setCart((current) => ({ ...current, [cartKey]: (current[cartKey] || 0) + 1 }))
  const remove = (cartKey) => setCart((current) => { const next = { ...current }; if ((next[cartKey] || 0) <= 1) delete next[cartKey]; else next[cartKey] -= 1; return next })
  const placeOrder = () => {
    if (payment === 'Card') {
      const cardNumber = cardDetails.number.replace(/\s/g, '')
      if (!cardDetails.name.trim() || cardNumber.length < 16 || !/^\d{2}\/\d{2}$/.test(cardDetails.expiry) || cardDetails.cvv.length < 3) {
        alert('Please enter complete and valid card details.')
        return
      }
    }
    alert(`Order placed! Payment: ${payment}${payment === 'UPI' ? ` (${upiApp})` : ''}. Total: ₹${cartTotal}`)
    setCardDetails({ name: '', number: '', expiry: '', cvv: '' })
    setCart({})
    setCartOpen(false)
  }

  return (
    <main className="dotpe-store">
      <header className="store-header">
        <div className="store-brand"><div className="dotpe-logo"><span>SUB</span><b>WAY</b></div><div><strong>Manipal University Jaipur</strong><small>MUJ Campus Store</small></div></div>
        <div className="header-actions">
          <div className="service-wrap"><button className="service-button" onClick={() => setServiceOpen(!serviceOpen)}>{service}<ChevronDown size={16} /></button>{serviceOpen && <div className="service-menu"><button onClick={() => { setService('Dine In'); setServiceOpen(false) }}>Dine In</button><button onClick={() => { setService('Takeaway'); setServiceOpen(false) }}>Takeaway</button></div>}</div>
          <button className="header-cart" aria-label={`${cartCount} items in cart`} onClick={() => cartCount > 0 && setCartOpen(true)}><ShoppingBag size={19} /><span>{cartCount}</span></button>
        </div>
      </header>

      <div className="store-tools">
        <label className="store-search"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for items…" />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button>}</label>
        <div className="diet-filter" aria-label="Diet filter">
          <button className={dietFilter === 'veg' ? 'active veg-filter' : 'veg-filter'} onClick={() => setDietFilter(dietFilter === 'veg' ? 'all' : 'veg')}><span /><b>Veg only</b></button>
          <button className={dietFilter === 'nonveg' ? 'active nonveg-filter' : 'nonveg-filter'} onClick={() => setDietFilter(dietFilter === 'nonveg' ? 'all' : 'nonveg')}><i /><b>Non-veg only</b></button>
        </div>
      </div>

      {!search && <nav className="category-strip"><button className={showAll ? 'active' : ''} onClick={() => setShowAll(true)}>All items</button>{menuSections.map((section) => <button key={section.name} className={!showAll && active === section.name ? 'active' : ''} onClick={() => { setActive(section.name); setShowAll(false) }}>{section.name}</button>)}</nav>}

      <section className="full-menu">
        {filteredSections.map((section, sectionIndex) => <section className="full-menu-section" key={section.name}>
          <div className="section-title"><span>0{sectionIndex + 1}</span><div><p>SUBWAY MENU</p><h1>{section.name}</h1></div></div>
          {section.groups.map((group) => <div className="menu-group" key={group.name}>
            <div className="group-heading"><span className={group.veg ? 'veg-symbol' : 'nonveg-symbol'} /><h2>{group.name}</h2></div>
            <div className="item-list">
              {group.items.map(([name, description, sixInch]) => {
                const sixKey = `${name}||6 inch`
                const sixQty = cart[sixKey] || 0
                const singleKey = `${name}||single`
                const singleQty = cart[singleKey] || 0
                return section.name === 'Signature Subs' ? (
                  <article className="store-item signature-item" key={name}>
                    <div className="item-copy"><h3>{name}</h3><p>{description}</p></div>
                    <div className="signature-price"><strong>₹{sixInch}</strong><span>6 inch</span></div>
                    {sixQty === 0 ? <button className="store-add" onClick={() => add(sixKey)}>ADD <Plus size={15} /></button> : <div className="quantity-control"><button aria-label={`Remove 6 inch ${name}`} onClick={() => remove(sixKey)}><Minus size={14} /></button><span>{sixQty}</span><button aria-label={`Add 6 inch ${name}`} onClick={() => add(sixKey)}><Plus size={14} /></button></div>}
                  </article>
                ) : (
                  <article className="store-item simple-item" key={name}>
                    <div className="item-copy"><h3>{name}</h3><p>{description}</p></div>
                    <strong className="single-price">₹{sixInch}</strong>
                    {singleQty === 0 ? <button className="store-add" onClick={() => add(singleKey)}>ADD <Plus size={15} /></button> : <div className="quantity-control"><button aria-label={`Remove ${name}`} onClick={() => remove(singleKey)}><Minus size={14} /></button><span>{singleQty}</span><button aria-label={`Add ${name}`} onClick={() => add(singleKey)}><Plus size={14} /></button></div>}
                  </article>
                )
              })}
            </div>
          </div>)}
        </section>)}
        {filteredSections.length === 0 && <div className="empty-menu"><h2>No matching items</h2><p>Try another search or change the diet filter.</p></div>}
      </section>

      {cartOpen && <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="Your cart">
        <div className="cart-panel">
          <div className="cart-header"><div><p>YOUR ORDER</p><h2>Cart</h2></div><button aria-label="Close cart" onClick={() => { setCardDetails({ name: '', number: '', expiry: '', cvv: '' }); setCartOpen(false) }}><X size={20} /></button></div>
          <div className="cart-items">
            {Object.entries(cart).map(([cartKey, quantity]) => {
              const [name, size] = cartKey.split('||')
              return <div className="cart-item" key={cartKey}><div><strong>{name}</strong><small>{size}</small></div><div className="cart-item-controls"><button aria-label={`Remove ${name}`} onClick={() => remove(cartKey)}><Minus size={14} /></button><span>{quantity}</span><button aria-label={`Add ${name}`} onClick={() => add(cartKey)}><Plus size={14} /></button></div><strong>₹{findItem(cartKey) * quantity}</strong></div>
            })}
          </div>
          <div className="payment-section"><h3>Payment method</h3><div className="payment-options">
            {['UPI', 'Card'].map((method) => <button key={method} className={payment === method ? 'active' : ''} onClick={() => { setPayment(method); if (method === 'UPI') setCardDetails({ name: '', number: '', expiry: '', cvv: '' }) }}><span>{payment === method ? '✓' : ''}</span>{method}</button>)}
          </div>
          {payment === 'UPI' && <div className="upi-section"><p>Select UPI app</p><div className="upi-apps">
            {[
              { name: 'Paytm', logo: '/paytm-logo.png', className: 'paytm-logo' },
              { name: 'Google Pay', logo: '/google-pay-logo.png', className: 'googlepay-logo' },
              { name: 'PhonePe', logo: '/phonepe-logo.png', className: 'phonepe-logo' },
              { name: 'BHIM', logo: '/bhim.svg', className: 'bhim-logo' },
            ].map((app) => <button key={app.name} className={upiApp === app.name ? 'active' : ''} onClick={() => setUpiApp(app.name)}><img className={`upi-app-logo ${app.className}`} src={app.logo} alt="" /><span>{app.name}</span></button>)}
          </div></div>}
          {payment === 'Card' && <div className="card-section">
            <label>Cardholder name<input type="text" autoComplete="off" value={cardDetails.name} onChange={(event) => setCardDetails((current) => ({ ...current, name: event.target.value }))} placeholder="Name on card" /></label>
            <label>Card number<input type="text" inputMode="numeric" autoComplete="off" maxLength={19} value={cardDetails.number} onChange={(event) => setCardDetails((current) => ({ ...current, number: event.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() }))} placeholder="1234 5678 9012 3456" /></label>
            <div className="card-row"><label>Expiry<input type="text" inputMode="numeric" autoComplete="off" maxLength={5} value={cardDetails.expiry} onChange={(event) => setCardDetails((current) => ({ ...current, expiry: event.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2') }))} placeholder="MM/YY" /></label><label>CVV<input type="password" inputMode="numeric" autoComplete="off" maxLength={4} value={cardDetails.cvv} onChange={(event) => setCardDetails((current) => ({ ...current, cvv: event.target.value.replace(/\D/g, '') }))} placeholder="CVV" /></label></div>
            <small className="payment-note">Card details are used only for this payment and are not saved.</small>
          </div>}
          </div>
          <div className="cart-summary"><span>Subtotal</span><strong>₹{cartTotal}</strong></div>
          <button className="checkout-button" onClick={placeOrder}>Place order · ₹{cartTotal}</button>
        </div>
      </div>}

      {cartCount > 0 && <aside className="cart-bar"><div><ShoppingBag size={20} /><span><b>{cartCount} {cartCount === 1 ? 'item' : 'items'}</b><small>Added to your order</small></span></div><button onClick={() => setCartOpen(true)}>View cart <strong>₹{cartTotal}</strong></button></aside>}
      <footer className="store-footer"><div className="footer-logo"><span>SUB</span><b>WAY</b></div><p>SUBWAY® is a registered trademark. Menu and prices may vary by location.</p><strong>Shop No. 1, Hostel Block B-1<br />Manipal University Jaipur, Rajasthan 303007</strong></footer>
    </main>
  )
}
