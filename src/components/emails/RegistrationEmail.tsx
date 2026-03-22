import * as React from 'react';

interface RegistrationEmailProps {
  memberName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  registrationCode: string;
  status: string;
}

export const RegistrationEmail: React.FC<RegistrationEmailProps> = ({
  memberName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  registrationCode,
  status,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Registration Confirmation - Sobat Sabtu</title>
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={logoStyle}>
              <span>SOBAT SABTU</span>
            </div>
            <div style={badgeStyle}>Registration Confirmation</div>
          </div>

          {/* Content */}
          <div style={contentStyle}>
            <h1 style={titleStyle}>You're In! 🎉</h1>
            <p style={subtitleStyle}>Thank you for registering with Sobat Sabtu</p>

            {/* Member Info Card */}
            <div style={infoCardStyle}>
              <div style={infoRowStyle1}>
                <span style={infoLabelStyle}>Member Name</span>
                <span style={infoValueStyle}>{memberName}</span>
              </div>
              <div style={infoRowStyle2}>
                <span style={infoLabelStyle}>Status</span>
                <span style={infoValueStyle}>
                  <span style={statusBadgeStyle}>{status.toUpperCase()}</span>
                </span>
              </div>
            </div>

            {/* Registration Code Box */}
            <div style={codeBoxStyle}>
              <div style={codeLabelStyle}>YOUR REGISTRATION CODE</div>
              <div style={codeStyle}>{registrationCode}</div>
            </div>

            {/* Event Details */}
            <div style={eventDetailsStyle}>
              <div style={eventDetailsTitleStyle}>Event Details</div>
              <div style={eventDetailItemStyle}>
                {/* <div style={eventIconStyle}>Title:</div> */}
                <div><strong>{eventName}</strong></div>
              </div>
              <div style={eventDetailItemStyle}>
                {/* <div style={eventIconStyle}>Date:</div> */}
                <div>{eventDate} - {eventTime} WIB</div>
              </div>
              <div style={eventDetailItemStyle}>
                {/* <div style={eventIconStyle}>Location:</div> */}
                <div>{eventLocation}</div>
              </div>
            </div>

            {/* CTA Button */}
            {/* <div style={buttonContainerStyle}>
              <a href="#" style={buttonStyle}>
                View My Registration
              </a>
            </div> */}
          </div>

          {/* Footer */}
          <div style={footerStyle}>
            <div style={footerTextStyle}>#untalentedrunners • #pelarikonten</div>
            <div style={footerTextStyle}>
              Sobat Sabtu - Turning "Mager" into Adventure Since 2019
            </div>
            {/* <div style={socialLinksStyle}>
              <a href="#" style={socialLinkStyle}>Instagram</a>
              <a href="#" style={socialLinkStyle}>Strava</a>
              <a href="#" style={socialLinkStyle}>TikTok</a>
              <a href="#" style={socialLinkStyle}>Spotify</a>
            </div> */}
            <div style={{ ...footerTextStyle, marginTop: 16 }}>
              © {new Date().getFullYear()} Sobat Sabtu. All rights reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

// Styles
const bodyStyle: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
  margin: 0,
  padding: 20,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 600,
  margin: '0 auto',
  background: '#ffffff',
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
};

const headerStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0928d5 0%, #4a6cf7 100%)',
  padding: '24px 20px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const logoStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 800,
  color: '#ffffff',
  position: 'relative',
  zIndex: 1,
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  padding: '8px 16px',
  borderRadius: 50,
  fontSize: 12,
  fontWeight: 500,
  color: '#ffffff',
  marginTop: 16,
  position: 'relative',
  zIndex: 1,
};

const contentStyle: React.CSSProperties = {
  padding: '20px 16px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  color: '#0928d5',
  marginBottom: 0,
  marginTop: 0,
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 14,
  color: '#666666',
  marginBottom: 24,
  borderBottom: '2px solid #f0f0f0',
  paddingBottom: 12,
};

const infoCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  borderRadius: 16,
  padding: 16,
  border: '1px solid #e9ecef',
};

const infoRowStyle1: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingBottom: 10,
  borderBottom: '1px solid #e9ecef',
};

const infoRowStyle2: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: 10,
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#0928d5',
  minWidth: 120,
};

const infoValueStyle: React.CSSProperties = {
  color: '#333333',
  textAlign: 'right' as const,
  flex: 1,
};

const statusBadgeStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#10b981',
  color: '#ffffff',
  padding: '6px 16px',
  borderRadius: 50,
  fontSize: 10,
  fontWeight: 600,
};

const codeBoxStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0928d5 0%, #4a6cf7 100%)',
  borderRadius: 12,
  padding: 16,
  textAlign: 'center',
  margin: '12px 0',
};

const codeLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: 'rgba(255, 255, 255, 0.8)',
  letterSpacing: 1,
  marginBottom: 8,
};

const codeStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  fontFamily: 'monospace',
  color: '#ffffff',
  letterSpacing: 2,
};

const eventDetailsStyle: React.CSSProperties = {
  background: '#f0f7ff',
  borderRadius: 12,
  padding: 16,
  margin: '12px 0',
};

const eventDetailsTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 16,
  color: '#0928d5',
};

const eventDetailItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0',
  color: '#333333',  
};

// const buttonContainerStyle: React.CSSProperties = {
//   textAlign: 'center',
// };

// const buttonStyle: React.CSSProperties = {
//   display: 'inline-block',
//   background: 'linear-gradient(135deg, #0928d5 0%, #4a6cf7 100%)',
//   color: '#ffffff',
//   textDecoration: 'none',
//   padding: '12px 32px',
//   borderRadius: 50,
//   fontWeight: 600,
//   marginTop: 16,
// };

const footerStyle: React.CSSProperties = {
  background: '#f8f9fa',
  padding: '24px 30px',
  textAlign: 'center',
  borderTop: '1px solid #e9ecef',
};

const footerTextStyle: React.CSSProperties = {
  color: '#666666',
  fontSize: 12,
  marginBottom: 8,
};

const socialLinksStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 16,
  gap: 16,
};

const socialLinkStyle: React.CSSProperties = {
  color: '#0928d5',
  textDecoration: 'none',
  fontSize: 12,
};

// Media query styles (for email clients that support)
const mediaQueryStyles = `
  @media (max-width: 600px) {
    .container {
      border-radius: 16px;
    }
    .content {
      padding: 24px 20px;
    }
    .info-row {
      flex-direction: column;
      gap: 8px;
    }
    .info-value {
      text-align: left;
    }
  }
`;