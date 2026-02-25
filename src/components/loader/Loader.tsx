'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

const Loader = ({size = 4}: {size?: number}) => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <Loader2 className={`w-${size} h-${size} animate-spin`} />
        </div>
    );
};

export default Loader;