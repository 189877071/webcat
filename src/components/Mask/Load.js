import React, { Component } from 'react'

class Load extends Component {
    render() {
        return (
            <div>
                <div className="load" ref="box">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <h1 className="load-h1">…… 正在加载 ……</h1>
            </div>
        )
    }
    componentDidMount() {
        setMarginTop(this.refs.box);
        const aSpan = this.refs.box.querySelectorAll('span');
        const r = 70;
        const jd = 360 / aSpan.length;
        for (let i = 0; i < aSpan.length; i++) {
            const fudu = Math.PI / 180 * (360 - jd * i);
            const x = Math.cos(fudu) * r;
            const y = Math.sin(fudu) * r;
            aSpan[i].style.left = x + 'px';
            aSpan[i].style.top = y + 'px';
            aSpan[i].style.animationDelay = (i + 1) * 0.1 + 's';
        }
    }
}

export default Load;