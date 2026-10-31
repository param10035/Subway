import { useMemo, useState } from 'react'
import { ChevronDown, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react'

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
  const [vegOnly, setVegOnly] = useState(false)
  const [service, setService] = useState('Dine In')
  const [serviceOpen, setServiceOpen] = useState(false)
  const [cart, setCart] = useState({})
  const [showAll, setShowAll] = useState(true)

  const filteredSections = useMemo(() => {
    const sections = showAll ? menuSections : menuSections.filter((section) => section.name === active)
    return sections.map((section) => ({
      ...section,
      groups: section.groups.map((group) => ({
        ...group,
        items: group.items.filter(([name, description]) => {
          if (vegOnly && !group.veg) return false
          if (!search.trim()) return true
          const query = search.toLowerCase()
          return name.toLowerCase().includes(query) || description.toLowerCase().includes(query)
        }),
      })).filter((group) => group.items.length > 0),
    })).filter((section) => section.groups.length > 0)
  }, [active, search, vegOnly, showAll])

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

  return (
    <main className="dotpe-store">
      <header className="store-header">
        <div className="store-brand"><div className="dotpe-logo"><span>SUB</span><b>WAY</b></div><div><strong>Manipal University Jaipur</strong><small>MUJ Campus Store</small></div></div>
        <div className="service-wrap"><button className="service-button" onClick={() => setServiceOpen(!serviceOpen)}>{service}<ChevronDown size={16} /></button>{serviceOpen && <div className="service-menu"><button onClick={() => { setService('Dine In'); setServiceOpen(false) }}>Dine In</button><button onClick={() => { setService('Takeaway'); setServiceOpen(false) }}>Takeaway</button></div>}</div>
      </header>

      <div className="store-tools">
        <label className="store-search"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for items…" />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={16} /></button>}</label>
        <button className={`veg-toggle ${vegOnly ? 'active' : ''}`} onClick={() => setVegOnly(!vegOnly)}><span /><b>Veg only</b></button>
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
        {filteredSections.length === 0 && <div className="empty-menu"><h2>No matching items</h2><p>Try another search or turn off the veg filter.</p></div>}
      </section>

      {cartCount > 0 && <aside className="cart-bar"><div><ShoppingBag size={20} /><span><b>{cartCount} {cartCount === 1 ? 'item' : 'items'}</b><small>Added to your order</small></span></div><button>View cart <strong>₹{cartTotal}</strong></button></aside>}
      <footer className="store-footer"><div className="footer-logo"><span>SUB</span><b>WAY</b></div><p>SUBWAY® is a registered trademark. Menu and prices may vary by location.</p><strong>Shop No. 1, Hostel Block B-1<br />Manipal University Jaipur, Rajasthan 303007</strong></footer>
    </main>
  )
}
