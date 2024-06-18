import React, { useState } from 'react'
import { IoMdArrowDropup, IoMdArrowDropdown } from 'react-icons/io' // İkonları kendi kullanıyorsanız, burada uygun şekilde import edin

const ArrowComponent = ({ defaultConditions }) => {
  const [conditions, setConditions] = useState(defaultConditions)

  const toggleArrow = () => {
    setConditions(conditions === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div onClick={toggleArrow}>
      {conditions === 'asc' ? (
        <IoMdArrowDropup size={20} />
      ) : (
        <IoMdArrowDropdown size={20} />
      )}
    </div>
  )
}

export default ArrowComponent
