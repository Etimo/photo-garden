
import React from "react"
class SimpleSocket extends React.Component{
	constructor(props) {
        super(props)
        this.state={};
    }
    componentDidMount(){
        let socket = new WebSocket(this.props.url);
        socket.onmessage = this.props.onmessage
        this.setState({
            socket:socket
        });
    }
    render(){
        return <span className="SocketSpan"></span>
    }
    
}
export default SimpleSocket;