import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import PhotoCard from './PhotoCard'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { addTrailingSlash } from '../utils'
import { featuredImagePropTypes } from '../proptypes'

const Moment = moment().constructor

const PhotoFeed = ({ isPreview, posts }) => {
  const [activePost, setActivePost] = useState(null)
  const [isLightboxActive, setIsLightboxActive] = useState(false)

  const handleClick = (post) => {
    setActivePost(post)
    setIsLightboxActive(true)
  }

  const handleClose = () => {
    setIsLightboxActive(false)
    setActivePost(null)
  }

  const handleNavigation = (direction) => {
    const currentIndex = posts.findIndex(({ image, slug, pageTitle, date, teaser }) => image.d.childImageSharp.fluid.src === activePost.image.d.childImageSharp.fluid.src)
    const newIndex = direction === 'left' ? (currentIndex === 0 ? posts.length - 1 : currentIndex - 1) : (currentIndex === posts.length - 1 ? 0 : currentIndex + 1)
    setActivePost(posts[newIndex])
  }

  return (
    <Fragment>
      {!isPreview &&
        !!posts &&
        !!posts.length &&
        posts.map(({ image, slug, pageTitle, date, teaser }, index) => {
          return (
            <PhotoCard
              date={date}
              count={index}
              image={image}
              key={uuidv4()}
              teaser={teaser}
              pageTitle={pageTitle}
              slug={addTrailingSlash(slug)}
              onClick={() => handleClick({ image, slug, pageTitle, date, teaser })}
            />
          )
        })}
      {!isPreview && (!posts || !posts.length) && (
        <div>No posts yet. Please check back again soon!</div>
      )}
      {!!isPreview && (
        <div>Your posts will appear here in reverse chronological order</div>
      )}

      {isLightboxActive && (
        <section className="lightbox-container active">
          <span className="lightbox-btn left" onClick={() => handleNavigation('left')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.5 17L9.5 12L14.5 7" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span className="lightbox-btn right" onClick={() => handleNavigation('right')}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 7L14.5 12L9.5 17" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span className="lightbox-btn close" onClick={handleClose}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 17L16.8995 7.10051" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M7 7.00001L16.8995 16.8995" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <div className="lightbox-image-wrapper">
            <img alt={activePost.pageTitle} className="lightbox-image" src={activePost.image.d.childImageSharp.fluid.src} />
            {!!activePost.teaser && (
              <p>{activePost.teaser}</p>
            )}
          </div>
        </section>
      )}
    </Fragment>
  )
}

PhotoFeed.propTypes = {
  isPreview: PropTypes.bool,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      image: featuredImagePropTypes,
      slug: PropTypes.string,
      pageTitle: PropTypes.string.isRequired,
      date: PropTypes.instanceOf(Moment),
      teaser: PropTypes.string,
    }),
  ),
}

export default PhotoFeed
