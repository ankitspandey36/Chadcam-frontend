import React from 'react'
import { useId } from 'react'
import { forwardRef } from 'react'

const Input = forwardRef(function ({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const Id = useId();
    return (
        <div className='w-full'>

            {label && <label className='inline-block mb-1 pl-1 text-white' htmlFor={Id}>{label}</label>}

            < input
                type={type}
                id={Id}
                ref={ref}
                className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}'
                {...props}
            >
            </input >

        </div>
    )
})

export default Input