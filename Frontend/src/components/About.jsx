import React from 'react'

const About = () => {
  return (
    <div className="page">
      <h1>About Page</h1>
      
      <div className="about-content">
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            QuizGen is designed to make learning interactive and engaging through 
            customizable quizzes. We believe that knowledge testing should be 
            accessible, fun, and effective for everyone.
          </p>
        </section>

        <section className="features">
          <h2>Key Features</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <h3>🎯 Custom Quiz Creation</h3>
              <p>Create quizzes tailored to your specific needs and topics</p>
            </div>
            <div className="feature-item">
              <h3>📊 Detailed Analytics</h3>
              <p>Track your performance with comprehensive result analysis</p>
            </div>
            <div className="feature-item">
              <h3>⚡ Real-time Results</h3>
              <p>Get instant feedback and scores after completing quizzes</p>
            </div>
            <div className="feature-item">
              <h3>📱 Responsive Design</h3>
              <p>Take quizzes on any device with our mobile-friendly interface</p>
            </div>
          </div>
        </section>

        <section className="technology">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-item">
              <h4>Frontend</h4>
              <ul>
                <li>React.js</li>
                <li>React Router</li>
                <li>CSS3</li>
              </ul>
            </div>
            <div className="tech-item">
              <h4>Backend</h4>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="contact">
          <h2>Get in Touch</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> contact@quizgen.com</p>
            <p><strong>GitHub:</strong> github.com/quizgen</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About 