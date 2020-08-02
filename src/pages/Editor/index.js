import React, { useState } from 'react'
import Select from 'react-select'
import './styles.css'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/dracula.css';

import api from '../../services/api.js'

export default function Editor(){
    const [code, setCode] = useState('')
    const [lang, setLang] = useState('')

    const options = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'php', label: 'PHP' },
        { value: 'rust', label: 'Rust' },
        { value: 'python', label: 'Python' },
        { value: 'r', label: 'R' },
        { value: 'css', label: 'CSS' },
        { value: 'html', label: 'HTML' },
	{ value: 'java', label: 'Java' },
	{ value: 'c', label: 'C' },
	{ value: 'elixir', label: 'Elixir' },
    ]

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    
    async function handleIframe(e){
        e.preventDefault()

        let postCode = encodeURIComponent(code)

        let url = `<iframe width="650px" height="650px" style="border-style: solid;" src="http://langiframe.herokuapp.com/iframe?lang=${lang}&code=${postCode}"></iframe>`
        console.log(url)

        const copyToClipboard = str => {
            const el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        };

        copyToClipboard(url)
        alert('Iframe copied to clipboard')

    }
    async function exec(){

        if ( lang === 'javascript' ){
            try{
                const response = await api.post('/exec', { code } )
                const output = document.getElementById('output')

                if (response.data.error === false){
                    output.style.borderColor = 'black'
                    output.innerHTML = response.data.result
                }
                if (response.data.error === true){
                    output.innerHTML = response.data.result
                    output.style.borderColor = 'red'
                }

            }catch(err){
                console.log(err)
            }
        }

        else{
            const output = document.getElementById('output')
            output.innerHTML = `<strong>The server only can run Javascript code, not ${getParameterByName('lang')} </strong>`
        }
    }

    async function handleImage(e){
        e.preventDefault()

        const pageUrl = `http://langiframe.herokuapp.com/iframe?lang=${lang}&code=${code}`
        
        const output = document.getElementById('output')
        const oldOutput = output.innerHTML

        output.innerHTML = '<strong>Wait please...</strong>'

        const pagePath = await api.post('/print', { pageUrl })
	console.log(pagePath)
        const link = document.createElement('a');
	console.log( btoa(unescape(encodeURIComponent(pagePath.data))) )
        link.href = `data:image/png;base64,${ pagePath.data }`;
        link.download = 'ScreenshotLangIframe.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        output.innerHTML = oldOutput
    }

    return(
        <div className="editor-conteiner">

            <Select
            options={options}
            className="select"
            onChange={ (e) => { setLang(e.value) } }
            placeholder="Select your language"
            ></Select>

            <div className="ideBox">
                <form>
                    <div className="ide">
                        <CodeMirror
                        onChange={ (value) => { setCode(value.getValue()) } }
                        value={'// Insert your code here! :)'}
                        options={{
                            theme: 'dracula',
                            keyMap: 'sublime',
                            mode: lang,
                        }
                        }
                        />
                        <div className="buttons">
                            <input type="submit" className="button" onClick={handleIframe} value="Export to Iframe"></input>
                            <button className="button" onClick={handleImage} >Export to Image</button>
                            <div className="button" onClick={exec} >Execute</div>
                        </div>
                    </div>  
                </form>
                </div>

                <div className="output" id="output">
                    <p style={{color: "grey"}} >Output of your code</p>
                </div>
        </div>

    )
}
