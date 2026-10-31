import { useState } from 'react'
import { ArrowRight, MapPin, Menu, Plus, Search, ShoppingBag, UserRound, X } from 'lucide-react'

const sections = [
  {
    name: 'Salads & Wraps',
    subtitle: 'Choose a fresh salad or a wrapped favourite',
    items: [
      { name: 'Fresh Salad', description: 'Choose your favourite filling and turn it into a crisp salad', price: '₹219' },
      { name: 'Signature Wrap', description: 'Signature filling wrapped fresh with vegetables and sauces', price: '₹199' },
      { name: 'Veggie Delight Salad', description: 'A light mix of fresh vegetables and cheese', price: '₹199' },
      { name: 'Veggie Delight Wrap', description: 'Fresh vegetables wrapped in a soft tortilla', price: '₹199' },
      { name: 'Paneer Tikka Salad', description: 'Tandoori-style paneer with crisp vegetables', price: '₹239' },
      { name: 'Paneer Tikka Wrap', description: 'Paneer tikka, vegetables and your choice of sauce', price: '₹229' },
    ],
  },
  {
    name: 'Sub Cravers',
    subtitle: 'Big flavour made for everyday cravings',
    items: [
      { name: 'Classic Veg', description: 'Fresh vegetables, cheese and your favourite sauce', price: '₹79' },
      { name: 'Classic Chicken', description: 'Tender chicken with fresh vegetables and sauce', price: '₹119' },
      { name: 'Corn & Peas', description: 'Sweet corn, green peas and creamy toppings', price: '₹119' },
      { name: 'Veggie Delite', description: 'Light, fresh and loaded with garden vegetables', price: '₹149' },
      { name: 'Aloo Patty', description: 'Spiced potato patty with crisp vegetables', price: '₹140' },
      { name: 'Tandoori Paneer', description: 'Marinated paneer with smoky Indian flavours', price: '₹229' },
      { name: 'Spicy Chicken Seekh', description: 'Spiced chicken seekh with fresh vegetables', price: '₹209' },
      { name: 'Chicken Tikka', description: 'Tender chicken tikka with signature sauces', price: '₹229' },
    ],
  },
  {
    name: 'Signature Subs',
    subtitle: 'Our most-loved combinations and premium favourites',
    items: [
      { name: 'American Veggie Supreme', description: 'Vegetables, cheese and creamy sauces', price: '₹249' },
      { name: 'Chicken Supreme', description: 'Premium chicken, cheese and fresh vegetables', price: '₹299' },
      { name: 'Italian B.M.T.', description: 'Classic meats layered with vegetables and herbs', price: '₹259' },
      { name: 'Tandoori Chicken', description: 'Tandoori-seasoned chicken with Indian flavours', price: '₹229' },
      { name: 'Tandoori Paneer', description: 'Paneer tikka, vegetables and smoky sauce', price: '₹229' },
      { name: 'Spicy Chicken Seekh', description: 'Flavour-packed chicken seekh and vegetables', price: '₹209' },
      { name: 'Veg Shammi', description: 'Shammi-style patty with fresh toppings', price: '₹219' },
      { name: 'Chicken Keema', description: 'Indian-style chicken keema with vegetables', price: '₹240' },
    ],
  },
]

const categories = ['All items', ...sections.map((section) => section.name)]

export default function SubwayApp() {
  const [category, setCategory] = useState('All items')
  const [cart, setCart] = useState(0)
  const [open, setOpen] = useState(false)
  const visibleSections = category === 'All items' ? sections : sections.filter((section) => section.name === category)
  const visibleItemCount = category === 'All items' ? sections.reduce((sum, section) => sum + section.items.length, 0) : visibleSections[0]?.items.length || 0

  return (
    <main className="subway-site">
      <header className="topbar">
        <button className="logo" aria-label="Subway home"><span>SUB</span><i>WAY</i></button>
        <nav className={open ? 'navlinks visible' : 'navlinks'}>
          <a href="#menu" onClick={() => setOpen(false)}>Menu</a>
          <a href="#menu" onClick={() => setOpen(false)}>Our favorites</a>
          <a href="#offers" onClick={() => setOpen(false)}>Offers</a>
        </nav>
        <div className="header-tools">
          <button className="location"><MapPin size={17} /> Find a store</button>
          <button className="account"><UserRound size={18} /></button>
          <button className="cart" aria-label={`${cart} items in cart`}><ShoppingBag size={19} /><b>{cart}</b></button>
          <button className="mobile-toggle" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section className="hero-subway">
        <div className="hero-copy">
          <div className="hero-label"><span>NEW</span><p>Fresh from the oven</p></div>
          <h1>OWN<br /><em>YOUR</em><br />BITE.</h1>
          <p className="hero-intro">Fresh veggies. Oven-baked bread. Every choice made by you.</p>
          <div className="hero-actions"><a href="#menu" className="yellow-button">Explore menu <ArrowRight size={18} /></a></div>
        </div>
        <div className="hero-stage">
          <div className="green-arch" />
          <div className="flavor-stamp"><span>STACKED</span><b>FRESH</b></div>
          <div className="hero-lettermark"><small>SUBWAY</small><strong>®</strong><span>EAT FRESH</span></div>
          <div className="nutrition-card"><small>GREAT CHOICE</small><strong>Fresh<br />Subway</strong><span>made your way</span></div>
        </div>
      </section>

      <div className="marquee"><div>Fresh baked bread <i>◆</i> Made for you <i>◆</i> Every vegetable counts <i>◆</i> Eat fresh</div></div>

      <section className="menu-board" id="menu">
        <div className="menu-heading">
          <div><p>THE MENU</p><h2>Choose your sub.</h2></div>
          <button className="search"><Search size={17} /> Search menu</button>
        </div>

        <div className="category-row">
          {categories.map((name) => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}
        </div>

        <div className="menu-count"><span>{visibleItemCount} subs available</span><b>6-inch subs</b></div>

        {visibleSections.map((section, sectionIndex) => {
          const sectionItems = items.filter((item) => item.category === section)
          return (
            <section className="menu-section-block" key={section}>
              <div className="menu-section-heading"><span>0{sectionIndex + 1}</span><div><p>SUBWAY MENU</p><h3>{section}</h3></div></div>
              <div className="restaurant-list">
                {sectionItems.map((item) => (
                  <article className="restaurant-item" key={item.name}>
                    <div className="item-name"><span className="item-dot" style={{ background: item.accent }} /><div><h4>{item.name}</h4><p>{item.label}</p></div></div>
                    <div className="item-line" />
                    <strong className="item-price">{item.price}</strong>
                    <button className="add-button" onClick={() => setCart((count) => count + 1)} aria-label={`Add ${item.name}`}><Plus size={18} /></button>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </section>

      <section className="offers" id="offers"><p>LIMITED-TIME FLAVOR</p><h2>Fresh deal.<br />Zero boring bites.</h2><button>View offers <ArrowRight size={17} /></button></section>

      <footer><button className="logo footer-logo"><span>SUB</span><i>WAY</i></button><p>Eat fresh. Live flavorful.</p><div><a href="#menu">Menu</a><a href="#offers">Offers</a></div></footer>
    </main>
  )
}
