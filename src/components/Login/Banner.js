import './style.scss'

import React, { Component } from 'react'

class Banner extends Component {
    render() {
        return (
            <div className="banner" ref="banner">
                欢迎各位领导来此视察
            </div>
        )
    }
    componentDidMount() {
        const html = this.refs.banner.innerHTML;

        let [start, end, num, time] = ['', '', 0, null];

        for (let i = 0; i < html.length; i++) {
            start += `<span>${html[i]}`;
            end += '</span>';
        }

        this.refs.banner.innerHTML = start + end;

        const span = $(this.refs.banner).find('span');

        time = setInterval(() => {

            num >= span.length && clearInterval(time);

            span.eq(num).css('transform', 'rotateY(0deg)');

            num++;
        }, 100);
    }
}

export default Banner;
