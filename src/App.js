import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import StockForm from "./components/StockForm";
import StockList from "./components/StockList";
import StockDetails from "./components/StockDetails";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import TransactionFilter from "./components/TransactionByDate";
import Register from "./components/Register";
import Login from "./components/Login";
import UserDetails from "./components/UserDetails";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Stock & Transaction Management</h1>

          {/* Navigation Links */}
          <nav className="nav">
            <ul>
              <li>
                <Link to="/" className="navLink">Home</Link>
              </li>
              <li>
                <Link to="/create-stock" className="navLink">Create Stock</Link>
              </li>
              <li>
                <Link to="/getstocks" className="navLink">View All Stocks</Link>
              </li>
              <li>
                <Link to="/create-transaction" className="navLink">Create Transaction</Link>
              </li>
              <li>
                <Link to="/transactions/:username" className="navLink">View Transactions</Link>
              </li>
              <li>
                <Link to="/register" className="navLink">Register</Link>
              </li>
              <li>
                <Link to="/login" className="navLink">Login</Link>
              </li>
              <li>
                <Link to="/users/exampleUser" className="navLink">User Details</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Routes */}
        <main>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Stock Routes */}
            <Route path="/create-stock" element={<StockForm />} />
            <Route path="/getstocks" element={<StockList />} />
            <Route path="/stock/:ticker" element={<StockDetails />} />

            {/* Transaction Routes */}
            <Route path="/create-transaction" element={<TransactionForm />} />
            <Route path="/transactions/:username" element={<TransactionListWithUsername />} />
            <Route path="/transactions/filter/:username" element={<TransactionFilter />} />

            {/* Registration and Login  Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* User Details Route */}
            <Route path="/users/:username" element={<UserDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Home Component
const Home = () => (
  <div>
    <h2>Welcome to the Stock App</h2>
    <p>Manage your stocks and transactions with ease!</p>
    <div className="navList">
      <Link to="/register" className="navLink">Register</Link>
      <Link to="/login" className="navLink">Login</Link>
    </div>
  </div>
);


const TransactionListWithUsername = () => {
  const { username } = useParams();
  return <TransactionList username={username} />;
};


export default App;
