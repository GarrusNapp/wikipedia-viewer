import React, { Component, PureComponent } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      result: "default",
      formInput: ""
    }
    this.clearState = this.clearState.bind(this)
    this.getData = this.getData.bind(this)
    this.newQuery = this.newQuery.bind(this)
    this.handleWriting = this.handleWriting.bind(this)
  }

  handleWriting(e) {
    this.setState({formInput: e.target.value})
  }

  clearState() {
    this.setState({
      result: "",
      formInput: ""
    })
  }

  getData(url) {
    fetch(url, {
    	method: 'GET',
    }).then(
      (response) => {return response.json()} )
      .then(
        (data) => {this.setState({result: data})}
      )
  }

  newQuery(e) {
    let url, isRandom = e.target.getAttribute("random")
    if (isRandom) {
      url = 'https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&format=json&grnlimit=10&exintro&explaintext&origin=*'
    }
    else {
      let query = encodeURIComponent(this.state.formInput)
      url = `https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=extracts&origin=*&exintro&explaintext&exchars=500&gsrsearch=${query}`
      e.preventDefault()
    }
    this.getData(url)
    this.clearState()
  }

  render() {
    let display
    if (this.state.result === 'default') {
      display = <p></p>
    }
    else {
      display = this.state.result ? <MainWindow content={this.state.result} /> : <Wait />
    }
    return (
      <div className="App">
        <h1>Wikipedia viewer</h1>
        <SearchForm value={this.state.formInput} newQuery={this.newQuery} handleWriting={this.handleWriting} />
        <RandomButton newQuery={this.newQuery} />
        {display}
      </div>
    )
  }
}

class SearchForm extends Component {
  render() {
    return (
      <form onSubmit={this.props.newQuery}>
        <input type="text" value={this.props.value} onChange={this.props.handleWriting} />
        <input type="submit" value="Submit"/>
      </form>
    )
  }
}

class RandomButton extends Component {
  render() {
    return (
      <div>
        <button random="true" onClick={this.props.newQuery}>Random!</button>
      </div>
    )
  }
}

class Wait extends Component {
  // Displayed during API call
  render() {
    return <div className="loader"></div>
  }
}

class Result extends Component {
  render() {
    let data = this.props.data
    if (!data) {
      return <p>No results found.</p>
    }
    let items = Object.keys(data).map(
      (i) =>
      <div key={i}>
        <a href={'https://en.wikipedia.org/?curid=' + data[i].pageid}><h2>{data[i].title}</h2></a>
        <p>{data[i].pageId}{data[i].extract}</p>
      </div>
    )
    return <div className='result'>{items}</div>
  }
}

class MainWindow extends PureComponent {
  render() {
    let result = ""
    let flag = this.props.content.query || false
    if (flag) {
      result = flag.pages
    }
    return <div><Result data={result} /></div>
  }
}


export default App;
