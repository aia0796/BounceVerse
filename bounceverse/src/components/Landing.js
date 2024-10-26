import React, { useState, useEffect } from 'react';
import { Gamepad, Trophy, Coins, ArrowRight, Github, Twitter, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [account, setAccount] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const navigate = useNavigate();
    const handlePlayNow = () => {
        // Handle navigation here based on your app's requirements
        navigate("/game")
        console.log('Navigate to game');
    };

    const features = [
        {
            icon: <Gamepad className="w-12 h-12 mb-4 text-purple-500" />,
            title: "Engaging Gameplay",
            description: "Experience smooth controls and addictive platform jumping mechanics"
        },
        {
            icon: <Coins className="w-12 h-12 mb-4 text-purple-500" />,
            title: "Earn Tokens",
            description: "Collect coins and earn tokens as you play and progress"
        },
        {
            icon: <Trophy className="w-12 h-12 mb-4 text-purple-500" />,
            title: "Compete & Win",
            description: "Climb the leaderboards and compete for weekly prizes"
        }
    ];


    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(accounts[0]);
            } else {
                alert('Please install MetaMask!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            {/* <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Gamepad className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        BounceVerse
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={handlePlayNow}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    >
                        <span>Play Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={connectWallet}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                        {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                    </button>
                </div>
            </header> */}

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className={`text-6xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'} transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    Welcome to BounceVerse
                </h1>
                <p className={`text-xl mb-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    Jump into the future of gaming. Play, earn, and collect tokens in this Web3-enabled adventure!
                </p>
                <div className="space-x-4 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}">
                    <button
                        onClick={handlePlayNow}
                        className="px-8 py-4 text-xl rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Play Now
                    </button>
                    
                </div>
            </div>

            {/* Features Section */}
            <div className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4">
                    <h2 className={`text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Game Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg transform transition-all duration-500 hover:scale-105`}
                            >
                                <div className="text-center">
                                    {feature.icon}
                                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="container mx-auto px-4 py-16">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <div className="p-6">
                        <div className="text-4xl font-bold text-purple-500 mb-2">10K+</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Players</div>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl font-bold text-purple-500 mb-2">50K+</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tokens Earned</div>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl font-bold text-purple-500 mb-2">100K+</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Games Played</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={`py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                BounceVerse
                            </h3>
                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                The future of gaming meets Web3 technology.
                            </p>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Quick Links
                            </h3>
                            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li><button onClick={() => console.log('About')} className="hover:text-purple-500">About</button></li>
                                <li><button onClick={() => console.log('How to Play')} className="hover:text-purple-500">How to Play</button></li>
                                <li><button onClick={() => console.log('Leaderboard')} className="hover:text-purple-500">Leaderboard</button></li>
                                <li><button onClick={() => console.log('FAQ')} className="hover:text-purple-500">FAQ</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Resources
                            </h3>
                            <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li><button onClick={() => console.log('Documentation')} className="hover:text-purple-500">Documentation</button></li>
                                <li><button onClick={() => console.log('Token Info')} className="hover:text-purple-500">Token Info</button></li>
                                <li><button onClick={() => console.log('Support')} className="hover:text-purple-500">Support</button></li>
                                <li><button onClick={() => console.log('Terms')} className="hover:text-purple-500">Terms of Service</button></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Connect
                            </h3>
                            <div className="flex space-x-4">
                                <button className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                    <Twitter className="w-6 h-6" />
                                </button>
                                <button className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                                    <Github className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-600'} text-center`}>
                        <p>© 2024 BounceVerse. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;