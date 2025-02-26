import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { API_ROUTES } from '@/api';
import './styles.css';

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_ROUTES.ORDERS, {
        withCredentials: true,
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => {
    const hasAuthCookie = document.cookie
      .split('; ')
      .some((cookie) => cookie.startsWith('auth_token='));

    if (!hasAuthCookie) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [navigate]);

  const handleLogout = () => {
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    await fetchOrders();

    const formData = new FormData(e.target);
    const startDate = formData.get('startDate');
    const endDate = formData.get('endDate');
    const clientName = formData.get('clientName').toLowerCase();

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const isWithinDateRange =
        (!startDate || orderDate >= new Date(startDate)) &&
        (!endDate || orderDate <= new Date(endDate));
      const matchesClientName = order.user.name
        .toLowerCase()
        .includes(clientName);

      return isWithinDateRange && matchesClientName;
    });

    console.log({ startDate, endDate, clientName, filtered });

    setFilteredOrders(filtered);
  };

  const openDialog = (order) => {
    setSelectedOrder(order);
    const dialog = document.getElementById('orderDialog');
    dialog.showModal();
  };

  const closeDialog = () => {
    const dialog = document.getElementById('orderDialog');
    dialog.close();
  };

  return (
    <>
      <nav className='navbar'>
        <h1>Festival Feng</h1>
        <div className='logout-container'>
          <button className='logout-button' onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className='orders-container'>
        <h2>Pedidos do Festival Feng</h2>

        <form className='filters' onSubmit={handleFilter}>
          <input type='date' name='startDate' placeholder='Data Inicial' />
          <input type='date' name='endDate' placeholder='Data Final' />
          <input type='text' name='clientName' placeholder='Nome do Cliente' />
          <button className='filter-button' type='submit'>
            <FaSearch /> Filtrar
          </button>
        </form>

        <ul className='orders-list'>
          {filteredOrders.map((order) => (
            <li key={order.id} className='order-item'>
              <div className='order-details'>
                <span>{order.user.name}</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span>
                  {order.items
                    .reduce((total, item) => {
                      const price = item.value ?? item.price ?? 0;
                      return total + Number(price) * Number(item.quantity);
                    }, 0)
                    .toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                </span>
              </div>
              <div className='action-buttons'>
                <button
                  className='action-button'
                  onClick={() => openDialog(order)}
                >
                  <FaEye />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dialog id='orderDialog'>
        {selectedOrder && (
          <div>
            <h3>Detalhes do Pedido</h3>
            <p>
              <strong>Cliente:</strong> {selectedOrder.user.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.user.email}
            </p>
            <p>
              <strong>Telefone:</strong> {selectedOrder.user.phone}
            </p>
            <p>
              <strong>Data do Pedido:</strong>{' '}
              {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
            </p>
            <h4>Itens:</h4>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item?.name} <br />
                  {item?.description} <br />
                  {Number(item.value ?? item.price ?? 0).toLocaleString(
                    'pt-BR',
                    {
                      style: 'currency',
                      currency: 'BRL',
                    }
                  )}
                </li>
              ))}
            </ul>
            <button onClick={closeDialog}>Fechar</button>
          </div>
        )}
      </dialog>
    </>
  );
}
