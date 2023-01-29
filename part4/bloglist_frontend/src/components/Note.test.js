import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('Renders content in blog: Title and Author', () => {
    const blog = {
        title: "Test blog title",
        author: "Ed",
        url: "www.test.com",
        user: {
            username: "ehartley11",
            id: "63d3d1925deec2bded357e29"
        }
    }

    const user = {
        username: "ehartley11",
        id: "63d3d1925deec2bded357e29"
    }

    const { container } = render(<Blog blog={blog} user={user}/>)

    const div =container.querySelector('.blog')

    expect(div).toHaveTextContent('Test blog title')
    expect(div).toHaveTextContent('Ed')

})