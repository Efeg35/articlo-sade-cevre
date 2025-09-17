import React from 'react';

const TestPage = () => {
    console.log('[TestPage] Component rendered successfully');

    return (
        <div style={{
            backgroundColor: '#121826',
            color: 'white',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1>✅ React Test Page Works!</h1>
            <p>If you can see this, React is working</p>
            <button
                onClick={() => {
                    console.log('[TestPage] Button clicked');
                    alert('Button works!');
                }}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#D4A056',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    marginTop: '20px'
                }}
            >
                Test Button
            </button>
        </div>
    );
};

export default TestPage;