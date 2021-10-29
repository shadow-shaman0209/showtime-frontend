import { CONTRACTS, SOL_MAX_INT } from './constants'
import removeMd from 'remove-markdown'

export const classNames = (...classes) => {
	return classes.filter(Boolean).join(' ')
}

export const removeTags = str => {
	if (str === null || str === '') return false
	else str = str.toString()
	return removeMd(str.replace(/(<([^>]+)>)/gi, ' '))
}

export const truncateWithEllipses = (text, max) => {
	if (!text) return null
	return text.substr(0, max - 1) + (text.length >= max ? '...' : '')
}

export const formatAddressShort = address => {
	if (!address) return null

	// Skip over ENS names
	if (address.includes('.')) return address

	return `${address.slice(0, 4)}…${address.slice(address.length - 4, address.length)}`
}

export const copyToClipBoard = async textToCopy => {
	try {
		await navigator.clipboard.writeText(textToCopy)
	} catch (err) {
		console.error(err)
	}
}

export const getBidLink = item => {
	switch (item.contract_address) {
		case CONTRACTS.ZORA:
			return `https://zora.co/${item.creator_address_nonens}/${item.token_id}`
		case CONTRACTS.RARIBLE_V2:
		case CONTRACTS.RARIBLE_1155:
			return `https://rarible.com/token/${item.contract_address}:${item.token_id}`
		case CONTRACTS.KNOWNORIGIN:
			if (item.token_ko_edition) {
				return `https://knownorigin.io/gallery/${item.token_ko_edition}`
			} else {
				return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`
			}
		case CONTRACTS.PORTIONIO:
		case CONTRACTS.PORTIONIO_1155:
			if (item.token_img_original_url) {
				return `https://app.portion.io/#exchange?ID=${item.token_img_original_url.replace('https://ipfs.io/ipfs/', '')}`
			} else {
				return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`
			}
		case CONTRACTS.FOUNDATION:
			return `https://foundation.app/creator/nft-${item.token_id}`
		case CONTRACTS.SUPERRARE_V1:
			return `https://superrare.co/artwork/${item.token_id}`
		case CONTRACTS.SUPERRARE_V2:
			return `https://superrare.co/artwork-v2/${item.token_id}`
		case CONTRACTS.ASYNCART_V1:
			return `https://async.art/art/master/0x6c424c25e9f1fff9642cb5b7750b0db7312c29ad-${item.token_id}`
		case CONTRACTS.ASYNCART_V2:
			return `https://async.art/art/master/0xb6dae651468e9593e4581705a09c10a76ac1e0c8-${item.token_id}`
		case CONTRACTS.CRYPTOARTAI:
			if (item.token_edition_identifier) {
				return `https://cryptoart.ai/gallery/detail?id=${item.token_edition_identifier}`
			} else {
				return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`
			}
		case CONTRACTS.MINTABLE:
			if (item.token_listing_identifier) {
				return `https://mintable.app/t/item/t/${item.token_listing_identifier}`
			} else {
				return `https://opensea.io/assets/${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`
			}
		case CONTRACTS.EPHIMERA:
			return `https://ephimera.com/tokens/${item.token_id}`
		case CONTRACTS.KALAMINT:
			if (item.token_edition_identifier) {
				return `https://kalamint.io/collection/${item.token_edition_identifier}`
			} else {
				return `https://kalamint.io/token/${item.token_id}`
			}

		case CONTRACTS.HICETNUNC:
			return `https://www.hicetnunc.xyz/objkt/${item.token_id}`
		default:
			return `https://opensea.io/assets/${item.chain_identifier == 137 ? 'matic/' : ''}${item.contract_address}/${item.token_id}?ref=0xe3fac288a27fbdf947c234f39d6e45fb12807192`
	}
}

export const getContractName = item => {
	switch (item.contract_address) {
		case CONTRACTS.ZORA:
			return 'Zora'
		case CONTRACTS.RARIBLE_V2:
		case CONTRACTS.RARIBLE_1155:
			return 'Rarible'
		case CONTRACTS.KNOWNORIGIN:
			if (item.token_ko_edition) return 'KnownOrigin'
			else return 'OpenSea'
		case CONTRACTS.FOUNDATION:
			return 'Foundation'
		case CONTRACTS.SUPERRARE_V1:
		case CONTRACTS.SUPERRARE_V2:
			return 'SuperRare'
		case CONTRACTS.ASYNCART_V1:
		case CONTRACTS.ASYNCART_V2:
			return 'Async Art'
		case CONTRACTS.PORTIONIO:
		case CONTRACTS.PORTIONIO_1155:
			if (item.token_img_original_url) return 'Portion.io'
			else return 'OpenSea'
		case CONTRACTS.CRYPTOARTAI:
			if (item.token_edition_identifier) return 'CryptoArt.Ai'
			else return 'OpenSea'
		case CONTRACTS.MINTABLE:
			if (item.token_listing_identifier) return 'Mintable'
			else return 'OpenSea'
		case CONTRACTS.EPHIMERA:
			return 'Ephimera'
		case CONTRACTS.KALAMINT:
			return 'Kalamint'
		case CONTRACTS.HICETNUNC:
			return 'Hic Et Nunc'
		default:
			return 'OpenSea'
	}
}

export const getContractImage = item => {
	switch (item.contract_address) {
		case CONTRACTS.ZORA:
			return '/icons/zora.png'
		case CONTRACTS.RARIBLE_V2:
		case CONTRACTS.RARIBLE_1155:
			return '/icons/rarible.png'
		case CONTRACTS.KNOWNORIGIN:
			if (item.token_ko_edition) return '/icons/knownorigin.png'
			else return '/icons/opensea.png'
		case CONTRACTS.FOUNDATION:
			return '/icons/foundation.png'
		case CONTRACTS.SUPERRARE_V1:
		case CONTRACTS.SUPERRARE_V2:
			return '/icons/superrare.png'
		case CONTRACTS.ASYNCART_V1:
		case CONTRACTS.ASYNCART_V2:
			return '/icons/asyncart.png'
		case CONTRACTS.PORTIONIO:
		case CONTRACTS.PORTIONIO_1155:
			if (item.token_img_original_url) return '/icons/portion.png'
			else return '/icons/opensea.png'
		case CONTRACTS.CRYPTOARTAI:
			if (item.token_edition_identifier) return '/icons/cryptoartai.png'
			else return '/icons/opensea.png'
		case CONTRACTS.MINTABLE:
			if (item.token_listing_identifier) return '/icons/mintable.png'
			else return '/icons/opensea.png'
		case CONTRACTS.EPHIMERA:
			return '/icons/ephimera.png'
		case CONTRACTS.KALAMINT:
			return '/icons/kalamint.png'
		case CONTRACTS.HICETNUNC:
			return '/icons/hicetnunc.png'
		default:
			return '/icons/opensea.png'
	}
}

export const filterNewRecs = (newRecs, oldRecs, alreadyFollowed) => {
	let filteredData = []
	newRecs.forEach(newRec => {
		if (!oldRecs.find(oldRec => oldRec.profile_id === newRec.profile_id) && !alreadyFollowed.find(followed => followed.profile_id === newRec.profile_id)) {
			filteredData.push(newRec)
		}
	})
	return filteredData
}

export const buildFormData = data => {
	const formData = new FormData()

	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof File || typeof value !== 'object') return formData.append(key, value)

		formData.append(key, JSON.stringify(value))
	})

	return formData
}

export const personalSignMessage = async (web3, message) => {
	return web3.getSigner().provider.send('personal_sign', [message, await web3.getSigner().getAddress()])
}

export const signTokenPermit = async (web3, tokenContract, tokenAddr) => {
	const userAddress = await web3.getSigner().getAddress()
	const permit = {
		owner: userAddress,
		spender: process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
		value: SOL_MAX_INT,
		nonce: await tokenContract.nonces(userAddress),
		deadline: Date.now() + 120,
	}

	const signature = await web3.getSigner()._signTypedData(
		{
			name: 'Test Token',
			version: '1',
			chainId: 80001,
			verifyingContract: tokenAddr,
		},
		{
			Permit: [
				{ name: 'owner', type: 'address' },
				{ name: 'spender', type: 'address' },
				{ name: 'value', type: 'uint256' },
				{ name: 'nonce', type: 'uint256' },
				{ name: 'deadline', type: 'uint256' },
			],
		},
		permit
	)

	return { owner: permit.owner, deadline: permit.deadline, tokenAddr, signature }
}

export const switchToChain = (web3, chainId, chainDetails = { chainId }) => {
	return web3.provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: chainId }] }).catch(error => {
		if (error.code !== 4902) throw error

		return web3.provider.request({ method: 'wallet_addEthereumChain', params: [chainDetails] })
	})
}
