import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const RealTimeFeed = () => {
    const [feed, setFeed] = useState([]);
    const socket = io('http://localhost:7000');

    useEffect(() => {
        socket.on('activity', (data) => {
            setFeed(prevFeed => [...prevFeed, data]);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <div>
            {feed.map((item, index) => (
                <div key={index}>{item.message}</div>
            ))}
        </div>
    );
};

export default RealTimeFeed;
