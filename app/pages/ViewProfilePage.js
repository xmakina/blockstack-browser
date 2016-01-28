import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SocialAccountItem from '../components/SocialAccountItem'
import { getName, getVerifiedAccounts, getAvatarUrl } from '../utils/profile-utils.js'
import { IdentityActions } from '../store/identities'
import { SearchActions } from '../store/search'
import Image from '../components/Image'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local,
    nameLookupUrl: state.settings.api.nameLookupUrl
  }
}

function mapDispatchToProps(dispatch) {
  let actions = Object.assign(IdentityActions, SearchActions)
  return bindActionCreators(actions, dispatch)
}

class ViewProfilePage extends Component {
  static propTypes = {
    fetchCurrentIdentity: PropTypes.func.isRequired,
    updateCurrentIdentity: PropTypes.func.isRequired,
    updateQuery: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired,
    localIdentities: PropTypes.array.isRequired,
    nameLookupUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentIdentity: {
        id: null,
        profile: null,
        verifications: []
      }
    }
  }

  componentHasNewRouteParams(routeParams) {
    if (routeParams.index) {
      const profile = this.props.localIdentities[routeParams.index].profile,
            name = this.props.localIdentities[routeParams.index].id,
            verifications = []
      this.props.updateCurrentIdentity(name, profile, verifications)
    } else if (routeParams.name) {
      this.props.fetchCurrentIdentity(routeParams.name, this.props.nameLookupUrl)
    }
  }

  componentWillMount() {
    this.componentHasNewRouteParams(this.props.routeParams)
  }

  componentWillUnmount() {
    this.props.updateCurrentIdentity('', {}, [])
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routeParams !== this.props.routeParams) {
      this.componentHasNewRouteParams(nextProps.routeParams)
    }
    this.setState({
      currentIdentity: nextProps.currentIdentity
    })
  }

  render() {
    const blockchainId = this.state.currentIdentity.id,
          profile = this.state.currentIdentity.profile,
          verifications = this.state.currentIdentity.verifications
    const blockNumber = 387562,
          transactionNumber = 339,
          address = 'Address hidden',
          birthDate = 'Birth date hidden'
    const connections = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

    return ( 
      <div className="profile-spacer">
        { profile !== null && profile !== undefined ?
        <div>
          <div className="col-md-9">
            <div className="container">
              <div className="col-md-5">
                <div>
                  <div className="profile-wrap">
                    <div className="idcard-block">
                      <div className="id-flex">
                        <img className="img-idcard" src={getAvatarUrl(profile)} />
                        <div className="overlay"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Link to={this.props.location.pathname + "/edit"}
                    className="btn btn-primary btn-lg btn-pro-edit">
                    Edit
                  </Link>
                </div>
              </div>
              <div className="col-md-7">
                <div className="idcard-wrap">
                  <div className="idcard-body dim">
                    Registered in block <span className="inverse">#{blockNumber}</span>,<br/>
                    transaction <span className="inverse">#{transactionNumber}</span>
                  </div>
                  <h1 className="idcard-name">{getName(profile)}</h1>
                  <div className="idcard-body inverse">
                    {profile.description}
                  </div>
                  <div className="idcard-body dim">
                    {address}
                  </div>
                  <div className="idcard-body dim">
                    {birthDate}
                  </div>
                  <div className="pill-nav pull-right">
                    <Link to={this.props.location.pathname + "/export"}>
                      <img src="images/icon-export.svg"/>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <p className="profile-foot">Connections</p>
              {connections.map((connection, index) => {
                return (
                  <div key={index} className="connections">
                  </div>
                )
              })}
            </div>
          </div>
          <div className="col-md-3 pull-right profile-right-col-fill">
            <div className="profile-right-col inverse">
              <ul>
                {getVerifiedAccounts(profile, verifications).map(function(account) {
                  return (
                    <SocialAccountItem
                      key={account.service + '-' + account.identifier}
                      service={account.service}
                      identifier={account.identifier}
                      proofUrl={account.proofUrl} />
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        :
        <div></div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfilePage)