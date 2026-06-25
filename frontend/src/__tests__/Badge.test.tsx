import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '../components/ui/Badge'

describe('Badge Component', () => {
  it('renders badge children correctly', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies standard styles when no color is provided', () => {
    render(<Badge>Test Badge</Badge>)
    const badge = screen.getByText('Test Badge')
    expect(badge).toHaveClass('bg-slate-800')
  })

  it('applies custom style colors when color prop is passed', () => {
    render(<Badge color="#ef4444">Bug</Badge>)
    const badge = screen.getByText('Bug')
    expect(badge).toHaveStyle({
      color: '#ef4444',
      backgroundColor: '#ef444420'
    })
  })
})
