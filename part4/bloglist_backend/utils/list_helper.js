const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    let total = 0
    blogs.forEach(blog => {
        total += Number(blog.likes)
    });
    return total
}

const favoriteBlog = (blogs) => {
    let topIndex = -1
    let topLikes = 0
    blogs.forEach((blog, index) => {
        if (blog.likes > topLikes) {
            topIndex = index
            topLikes = blog.likes
        }
    })
    return blogs[topIndex]
}

  
  module.exports = {
    dummy, totalLikes, favoriteBlog
  }

