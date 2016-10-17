import React from 'react';
import ReactDOM from 'react-dom';
import MsgInput from './MsgInput';
import StatusBar from './StatusBar';
import ChatHistory from './chathistory';
import { webSocketAddr } from './globals';

class ChatApp extends React.Component {

  constructor() {
    super();
    this.state = { msgs: [], usersNumber: 0 };
    this.conn = new WebSocket(webSocketAddr);
  }

  componentDidMount() {
    this.conn.onmessage = (message) => {
      const reply = JSON.parse(message.data);
      switch (reply.message_type) {
        case 'user_count':
          this.setState({ usersNumber: reply.users_count });
          break;
        case 'initial_message_load':
          this.setState({ msgs: reply.payload });
          break;
        case 'new_chat_message':
          this.setState({ msgs: this.state.msgs.concat([reply.payload]) });
          break;
        default:
          console.error('Unknown message reply type from server');
      }
    };

    const initialMessageSendTimer = setInterval(() => {
      if (this.conn.readyState === 1) {
        this.conn.send(JSON.stringify({
          cmd: 'connect',
        }));
        clearInterval(initialMessageSendTimer);
      }
    }, 500);

    setInterval(() => {
      if (this.conn.readyState === 1) {
        this.conn.send(JSON.stringify({
          cmd: 'user_count',
        }));
      }
    }, 10 * 1000);
  }

  render() {
    const theBiggestContainer = {
      backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/c/cd/Tatev_Monastery_from_a_distance.jpg')",
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      height: '896px',
    };
    const programmersOnline = {
      flexGrow: '1',
      fontSize: '30px',
      color: 'white',
      padding: '14px 25px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
    };
    const sourceCode = {
      flexGrow: '1',
      fontSize: '30px',
      color: 'white',
      padding: '14px 25px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
    };
    const mainContainer = {
      marginTop: '10px',
      minWidth: '1024px',
      height: '900px',
      margin: '0px auto',
      width: '100%',
    };
    const statusBarStyle = {
      color: '#00ff9f',
      textAlign: 'center',
      backgroundColor: '#acb2ff',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      opacity: '0.7',
      logo: {
        postition: 'relative',
        left: '5px',
        margin: '2px',
      },
    };
    const chatHistoryStyle = {
      container: {
        marginLeft: '5px',
        marginRight: '5px',
        height: '74%',
        overflowY: 'scroll',
      },
      list_items: {
        listStyleType: 'none',
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: 'white',
        margin: '0.5em auto',
        padding: '.50rem',
        minWidth: '30px',
        maxWidth: '50%',
        backgroundColor: '#6641a7',
        opacity: '0.85',
      },
    };

    const buttonStyle = {
      backgroundColor: '#4CAF50',
      border: 'none',
      height: '1.5rem',
      color: 'white',
      margin: '.25rem',
      justifyContent: 'center',
      borderRadius: '5px',
      width: '100%',
    };
    const nameInput = {
      fontFamily: 'sans-serif',
      width: '7.5%',
      paddingLeft: '5px',
      transition: 'box-shadow 0.3s, border 0.3s',
      border: 'solid 1px #707070',
      fontSize: '12px',
      boxShadow: '0 0 5px 1px #969696',
    };
    const messageInput = {
      width: '100%',
      display: 'block',
      fontFamily: 'sans-serif',
      fontSize: '18px',
      paddingLeft: '5px',
      transition: 'box-shadow 0.3s, border 0.3s',
      border: 'solid 1px #707070',
      boxShadow: '0 0 5px 1px #969696',
    };
    // const task_window_style = {
    //     width: '950px',
    //     height: '350px',
    //     margin: 'auto',
    //     backgroundColor: '#01409c',
    //     color: 'white',
    //     fontSize: '20px',
    //     textAlign: 'center',
    //     borderRadius: '40px'
    // };
    return (
      <div style={theBiggestContainer}>
        <div style={mainContainer}>
          <StatusBar
            my_style={statusBarStyle}
            users={this.state.usersNumber}
            sourceCodeStyle={sourceCode}
            programmersOnlineStyle={programmersOnline}
          />
          <ChatHistory
            my_style={chatHistoryStyle}
            messages={this.state.msgs}
          />
          <MsgInput
            my_style={buttonStyle}
            name_style={nameInput}
            message_style={messageInput}
            send_message={msg => this.conn.send(JSON.stringify({
              cmd: 'new_message',
              payload: msg,
            }))}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ChatApp />, document.getElementById('react-container'));
