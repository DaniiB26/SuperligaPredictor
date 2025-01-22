import React, { useState, useEffect } from 'react';
import './QuoteBand.css';

const quotes = [
    "“Eu m-am născut să fiu învingător, nu să exist”",
    "“Un meci, care fiecare meci are istoria lui, adică momentele lui în care poate să îți meargă în favoarea ta, în pozitiv sau în negativ”",
    "“Haideți să mergem acolo, haideți să ieșim, să câștigăm orice, să facem, să fie bine ca să nu fie rău”",
    "“Cine face bine lumea te vede”",
    "“Am avut și noroc, și șansă”"
];

const QuoteBand: React.FC = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, 12000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="quote-band">
            <p>{quotes[currentQuoteIndex]}</p>
        </div>
    );
};

export default QuoteBand;
