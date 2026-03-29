import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('petco_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('petco_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id || item.id === product.id);
            if (existingItem) {
                toast.success(`Increased quantity for ${product.name}`);
                return prevCart.map(item => 
                    (item._id === product._id || item.id === product.id) 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }
            toast.success(`Added ${product.name} to cart`);
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => (item._id !== productId && item.id !== productId)));
        toast.success('Removed from cart');
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item._id === productId || item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('petco_cart');
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart, 
            cartTotal, 
            cartCount 
        }}>
            {children}
        </CartContext.Provider>
    );
};
