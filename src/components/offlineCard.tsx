import React from 'react';
import { Button } from 'antd';



export const OfflineNotificationCard: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48" height="48"
                    color='#ff4d4f'
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-wifi-off">
                    <path d="M12 20h.01" />
                    <path d="M8.5 16.429a5 5 0 0 1 7 0" />
                    <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
                    <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
                    <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
                    <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
                    <path d="m2 2 20 20" />
                </svg>
                <h2 className="text-2xl font-bold mb-2">Vous êtes hors ligne</h2>
                <p className="text-gray-600">Veuillez vérifier votre connexion internet ou actualiser la page</p>
                <Button
                    onClick={() => window.location.reload()}
                    type='primary'
                    className='mt-4 shadow-none uppercase'
                >
                    OK
                </Button>
            </div>
        </div>
    );
};

