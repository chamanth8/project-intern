import React, { useRef, useEffect, useState } from 'react';

import './calculator.css';

import { btns, BTN_ACTIONS } from './btnConfig';

const Calculator = () => {

    const btnsRef = useRef(null);
    const expRef = useRef(null);

    const [expression, setExpression] = useState('');
    const [history, sethistory] = useState([])

    useEffect(() => {
        const btns = Array.from(btnsRef.current.querySelectorAll('button'));
        btns.forEach(e => e.style.height = e.offsetWidth + 'px');
    }, []);
    useEffect(() => {
        const hiss = localStorage.getItem('history')
        console.log(JSON.parse(hiss))
        sethistory(JSON.parse(hiss))
    }, [])
    

    const btnClick = (item) => {
        const expDiv = expRef.current;

        if (item.action === BTN_ACTIONS.THEME) document.body.classList.toggle('dark');

        if (item.action === BTN_ACTIONS.ADD) {
            addAnimSpan(item.display);

            const oper = item.display !== 'x' ? item.display : '*';
            setExpression(expression + oper);
        }

        if (item.action === BTN_ACTIONS.DELETE) {
            expDiv.parentNode.querySelector('div:last-child').innerHTML = '';
            expDiv.innerHTML = '';

            setExpression('');
        }

        if (item.action === BTN_ACTIONS.CALC) {
            if (expression.trim().length <= 0) return;

            expDiv.parentNode.querySelector('div:last-child').remove();

            const cloneNode = expDiv.cloneNode(true);
            expDiv.parentNode.appendChild(cloneNode);

            const transform = `translateY(${-(expDiv.offsetHeight + 10) + 'px'}) scale(0.4)`;

            try {
                let res = eval(expression);
                // console.log({expre:expression,res})
                var historySet= history
                historySet.push({expression,res})
                sethistory(historySet)
                localStorage.setItem('history',JSON.stringify(historySet))
                setExpression(res.toString());
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    expDiv.innerHTML = '';
                    addAnimSpan(Math.floor(res * 100000000) / 100000000);
                }, 200);
            } catch {
                setTimeout(() => {
                    cloneNode.style.transform = transform;
                    cloneNode.innerHTML = 'Syntax err';
                }, 200);
            } finally {
                console.log('calc complete');
            }
        }
    }

    const addAnimSpan = (content) => {
        const expDiv = expRef.current;
        const span = document.createElement('span');

        span.innerHTML = content;
        span.style.opacity = '0';
        expDiv.appendChild(span);

        const width = span.offsetWidth + 'px';
        span.style.width = '0';

        setTimeout(() => {
            span.style.opacity = '1';
            span.style.width = width;
        }, 100);
    }
    console.log(typeof history)

    return (
        <div style={{display:'flex'}}>
            <div className="calculator">
                <div className="calculator__result">
                    <div ref={expRef} className="calculator__result__exp"></div>
                    <div className="calculator__result__exp"></div>
                </div>
                <div ref={btnsRef} className="calculator__btns">
                    {
                        btns.map((item, index) => (
                            <button
                                key={index}
                                className={item.class}
                                onClick={() => btnClick(item)}
                            >
                                {item.display}
                            </button>
                        ))
                    }
                </div>
            </div>
            <div className='calculator_m' style={{display:'flex',flexDirection:'column',flexWrap:'wrap',textAlign:'left',fontSize:'20px',backgroundColor:'white'}}>
                {history && history.length ? history.map((das,i)=>{
                    return(
                        <div key={i}>
                            <div className="" style={{}}>{das.expression} = {das.res}</div>
                        </div>
                    )
                }) : ''}
            </div>
        </div>
    );
}

export default Calculator;