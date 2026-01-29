import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { fetchLivePrices } from '../redux/slices/productSlice';

const PriceTicker = () => {
    const dispatch = useDispatch();
    const { livePrices } = useSelector(state => state.products);
    const [previousPrices, setPreviousPrices] = useState(null);

    useEffect(() => {
        dispatch(fetchLivePrices());

        // Refresh prices every 30 seconds
        const interval = setInterval(() => {
            if (livePrices) {
                setPreviousPrices(livePrices);
            }
            dispatch(fetchLivePrices());
        }, 30000);

        return () => clearInterval(interval);
    }, [dispatch]);

    if (!livePrices) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getChange = (current, key) => {
        if (!previousPrices) return 0;
        const prev = getPriceValue(previousPrices, key);
        return current - prev;
    };

    const getPriceValue = (prices, key) => {
        const [metal, purity] = key.split('_');
        return prices?.[metal]?.[purity] || 0;
    };

    const priceItems = [
        { label: 'Gold 24K', key: 'gold_24K', value: livePrices?.gold?.['24K'] },
        { label: 'Gold 22K', key: 'gold_22K', value: livePrices?.gold?.['22K'] },
        { label: 'Gold 18K', key: 'gold_18K', value: livePrices?.gold?.['18K'] },
        { label: 'Silver 999', key: 'silver_999', value: livePrices?.silver?.['999'] },
        { label: 'Silver 925', key: 'silver_925', value: livePrices?.silver?.['925'] },
        { label: 'Platinum', key: 'platinum_950', value: livePrices?.platinum?.['950'] },
    ];

    return (
        <div className="price-ticker">
            <div className="container">
                <div className="price-ticker-content">
                    {/* Duplicate items for seamless scroll */}
                    {[...priceItems, ...priceItems].map((item, index) => {
                        const change = getChange(item.value, item.key);
                        const isUp = change > 0;
                        const isDown = change < 0;

                        return (
                            <div key={`${item.key}-${index}`} className="price-item">
                                <span className="price-label">{item.label}</span>
                                <span className="price-value">{formatPrice(item.value)}/g</span>
                                {change !== 0 && (
                                    <span className={`price-change ${isUp ? 'up' : 'down'}`}>
                                        {isUp ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                        {formatPrice(Math.abs(change))}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PriceTicker;
