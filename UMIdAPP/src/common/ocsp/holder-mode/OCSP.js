import * as asn1js from "asn1js";
import { bufferToHexCodes } from "pvutils";
const pkijs = require("pkijs");
const crypto = require('crypto');
const _ = require("underscore");
import { HTTP } from '@ionic-native/http/ngx';
import * as GeneralMethods from '../../general/holder-mode/general';;

let ocspReqBuffer = new ArrayBuffer(0);


var x509_countryName = '2.5.4.6';
var x509_commonName = '2.5.4.3';

export async function verifyCertValidityOnOCSP(cert){
	const request = createOCSPResquest(cert);
	const  response = await sendOCSPRequest(request);
	var result;
	if(response !== null){
		result = verifyOCSPResponse(response);
	}
	else {
		result = 'good'
	}
	return result;
}

/**
 * Função responsável por criar o OCSP Request
 * @export
 */
export function createOCSPResquest(certificate) {

	//  extraindo elementos do certificado para construir o request OCSP
	const issuerNameHash = crypto.createHash('sha1')
		.update(Buffer.from(new Uint8Array(certificate.issuer.valueBeforeDecode)))
		.digest()
	//console.log('issuerNameHash', bufferToHexCodes(issuerNameHash));
	const serialNumberValue = certificate.serialNumber.valueBlock.valueHex;
	//console.log('serial number', bufferToHexCodes(serialNumberValue));
	const authorityKeyIdentifier = _.find(certificate.extensions, (extension) => extension.extnID === '2.5.29.35');
	const issuerKeyHash = authorityKeyIdentifier.parsedValue.keyIdentifier.valueBlock.valueHex;
	//console.log('Issuer Key Hash ', bufferToHexCodes(issuerKeyHash));

	const subjectAttributes = certificate.subject.typesAndValues;
	for (let index = 0; index < subjectAttributes.length; index++) {
		const attribute = subjectAttributes[index];
		if (attribute.type === x509_countryName) { 
			var countryName = attribute.value.valueBlock.value;
		}
		if (attribute.type === x509_commonName) {
			var commonName = attribute.value.valueBlock.value;

		}
	}
	//console.log('Country Name', countryName);
	//console.log('common name', commonName);


	// create ocsp request 
	const ocspReqSimpl = new pkijs.OCSPRequest();
    
	ocspReqSimpl.tbsRequest.requestorName = new pkijs.GeneralName({
		type: 4,
		value: new pkijs.RelativeDistinguishedNames({
			typesAndValues: [
				new pkijs.AttributeTypeAndValue({
					type: "2.5.4.6", // Country name
					value: new asn1js.PrintableString({ value: countryName })
				}),
				new pkijs.AttributeTypeAndValue({
					type: "2.5.4.3", // Common name
					value: new asn1js.BmpString({ value: commonName })
				})
			]
		})
	});
	
	ocspReqSimpl.tbsRequest.requestList = [new pkijs.Request({
		reqCert: new pkijs.CertID({
			hashAlgorithm: new pkijs.AlgorithmIdentifier({
				algorithmId: "1.3.14.3.2.26" // sha-1
			}),
			issuerNameHash: new asn1js.OctetString({ valueHex: issuerNameHash }),
			issuerKeyHash: new asn1js.OctetString({ valueHex: issuerKeyHash }),
			serialNumber: new asn1js.Integer({ valueHex: serialNumberValue })

		})
	})];

	const ocspNonceValue = crypto.randomBytes(18)
	//console.log('ocspNonceValue', Buffer.from(new Uint8Array(ocspNonceValue)).toString('hex'))
	ocspReqSimpl.tbsRequest.requestExtensions = [
		new pkijs.Extension({
			extnID: '1.3.6.1.5.5.7.48.1.2', // ocspNonce
			extnValue: (new asn1js.OctetString({ valueHex: ocspNonceValue })).toBER(false)
		})
	]

	ocspReqBuffer = ocspReqSimpl.toSchema(true).toBER(false);
	//console.log('der',ocspReqBuffer);
	const contentPem = (Buffer.from(new Uint8Array(ocspReqBuffer)).toString('base64'));

	let request = "";

	//resultString = `${resultString}\r\n-----BEGIN OCSP REQUEST-----\r\n`;
	request = `${request}${contentPem}`;
	//resultString = `${resultString}\r\n-----END OCSP REQUEST-----\r\n\r\n`;
	

	return request;
	// sendOCSPRequest(request);
}






/**
 *
 * Função responsável de enviar o OCSP Request para endpoint 
 * @export
 * @param {*} request 
 */
export async function sendOCSPRequest(request) {
	const http = new HTTP;

	var responseOCSP;
	// convertendo a OCSP Request em URI
	let URIrequest = encodeURIComponent(request);
	//console.log(`url:\n https://vhaslab05.inesctec.pt/ocsp/${URIrequest} `);
	
	// verificanto o tamanho do OCSP Request para usar o metodo do request http correspondente
	//console.log('Tamanho:',request.length);

	var reqOptions ;
	const sizeRequest = request.length;
    // verificar 
	if ( sizeRequest  <= 255){
		reqOptions = {
			method: 'get',
			responseType: 'arraybuffer',
			headers: {}
		}
	}
	else {
		const der = Buffer(request, 'base64');
		cordova.plugin.http.setDataSerializer('raw');
	    reqOptions = {
			method: 'post',
			data: der.buffer,
			responseType: 'arraybuffer',
			headers: {"Content-Type": "application/ocsp-request"}
		}
	}

	const link = `https://vhaslab05.inesctec.pt/ocsp/${URIrequest}`;
	
	const response = http.sendRequest(link, reqOptions).then(
		result => {
			var prefix = '-----BEGIN OCSP RESPONSE-----\n';
			var postfix = '-----END OCSP RESPONSE-----';
			const derBuffer = GeneralMethods.arrayBufferToBase64(result.data);
			const resultResponse  = prefix + derBuffer.match(/.{0,64}/g).join('\n') + postfix;
			return resultResponse 
		},
		error => {return null}
		);
	responseOCSP = await response;

	return responseOCSP;
}






/**
 *
 * Função responsável por verificar a resposta do OCSP verificando o estado do certificado
 * @export
 * @param {*} cert
 * @return {*} retorna o estado do certificado se está revogado ou
 */
export function verifyOCSPResponse(response) {


	//console.log('OCSP Response:', response);
	//region Initial variables 
	let ocspBasicResp;

	//region Decode existing OCSP response
	var ocspResponseBuffer = response.replace(/(-----(BEGIN|END) OCSP RESPONSE-----|[\n\r])/g, '');
	let der = new Buffer(ocspResponseBuffer, 'base64');
	const ber = new Uint8Array(der).buffer;
	const asn1 = asn1js.fromBER(ber);
	const ocspRespSimpl = new pkijs.OCSPResponse({ schema: asn1.result }); 


	let status = "";

	switch (ocspRespSimpl.responseStatus.valueBlock.valueDec) {
		case 0:
			status = "successful";
			break;
		case 1:
			status = "malformedRequest";
			break;
		case 2:
			status = "internalError";
			break;
		case 3:
			status = "tryLater";
			break;
		case 4:
			status = "<not used>";
			break;
		case 5:
			status = "sigRequired";
			break;
		case 6:
			status = "unauthorized";
			break;
		default:
			alert("Wrong OCSP response status");
			return;
	}


	console.log('Status', status);
	//endregion 

	//region Check that we do have "responseBytes" 
	if ("responseBytes" in ocspRespSimpl) {
		const asn1Basic = asn1js.fromBER(ocspRespSimpl.responseBytes.response.valueBlock.valueHex);
		ocspBasicResp = new pkijs.BasicOCSPResponse({ schema: asn1Basic.result });
	}
	else
		return; 

	
	const algomap = {
		"1.2.840.113549.2.1": "MD2",
		"1.2.840.113549.1.1.2": "MD2 with RSA",
		"1.2.840.113549.2.5": "MD5",
		"1.2.840.113549.1.1.4": "MD5 with RSA",
		"1.3.14.3.2.26": "SHA1",
		"1.2.840.10040.4.3": "SHA1 with DSA",
		"1.2.840.10045.4.1": "SHA1 with ECDSA",
		"1.2.840.113549.1.1.5": "SHA1 with RSA",
		"2.16.840.1.101.3.4.2.4": "SHA224",
		"1.2.840.113549.1.1.14": "SHA224 with RSA",
		"2.16.840.1.101.3.4.2.1": "SHA256",
		"1.2.840.113549.1.1.11": "SHA256 with RSA",
		"2.16.840.1.101.3.4.2.2": "SHA384",
		"1.2.840.113549.1.1.12": "SHA384 with RSA",
		"2.16.840.1.101.3.4.2.3": "SHA512",
		"1.2.840.113549.1.1.13": "SHA512 with RSA"
	};

	let signatureAlgorithm = algomap[ocspBasicResp.signatureAlgorithm.algorithmId];
	if (typeof signatureAlgorithm === "undefined")
		signatureAlgorithm = ocspBasicResp.signatureAlgorithm.algorithmId;
	else
		signatureAlgorithm = `${signatureAlgorithm} (${ocspBasicResp.signatureAlgorithm.algorithmId})`;


	//console.log('Algoritmo que fez o hash do ocsp responder:\n', signatureAlgorithm);


	//region Put information about "Responder ID" 
	if (ocspBasicResp.tbsResponseData.responderID instanceof pkijs.RelativeDistinguishedNames) {
		const typemap = {
			"2.5.4.6": "C",
			"2.5.4.10": "O",
			"2.5.4.11": "OU",
			"2.5.4.3": "CN",
			"2.5.4.7": "L",
			"2.5.4.8": "S",
			"2.5.4.12": "T",
			"2.5.4.42": "GN",
			"2.5.4.43": "I",
			"2.5.4.4": "SN",
			"1.2.840.113549.1.9.1": "E-mail"
		};

		for (let i = 0; i < ocspBasicResp.tbsResponseData.responderID.typesAndValues.length; i++) {
			let typeval = typemap[ocspBasicResp.tbsResponseData.responderID.typesAndValues[i].type];
			if (typeof typeval === "undefined")
				typeval = ocspBasicResp.tbsResponseData.responderID.typesAndValues[i].type;

			const subjval = ocspBasicResp.tbsResponseData.responderID.typesAndValues[i].value.valueBlock.value;

			//console.log('curiosity', ocspBasicResp.tbsResponseData.responderID.typesAndValues[i].type)
			//console.log(typeval);
			//console.log(subjval);
		}

	}
	else {
		if (ocspBasicResp.tbsResponseData.responderID instanceof asn1js.OctetString) {
			console.log(bufferToHexCodes(ocspBasicResp.tbsResponseData.responderID.valueBlock.valueHex, 0, ocspBasicResp.tbsResponseData.responderID.valueBlock.valueHex.byteLength));
		}
		else {
			console.log("Wrong OCSP response responderID");
			return;
		}
	}



	console.log('Data e hora da consulta\n', ocspBasicResp.tbsResponseData.producedAt.toString());


	//region Put information about extensions of the OCSP response 
	if ("responseExtensions" in ocspBasicResp) {
		const extenmap = {
			"1.3.6.1.5.5.7.48.1.2": "Nonce",
			"1.3.6.1.5.5.7.48.1.3": "CRL References",
			"1.3.6.1.5.5.7.48.1.4": "Acceptable Response Types",
			"1.3.6.1.5.5.7.48.1.6": "Archive Cutoff",
			"1.3.6.1.5.5.7.48.1.7": "Service Locator",
			"1.3.6.1.5.5.7.48.1.8": "Preferred Signature Algorithms",
			"1.3.6.1.5.5.7.48.1.9": "Extended Revoked Definition",
			"2.5.29.21": "CRL Reason",
			"2.5.29.24": "Invalidity Date",
			"2.5.29.29": "Certificate Issuer",
			"1.3.6.1.4.1.311.21.4": "Next Update"
		};

		for (let i = 0; i < ocspBasicResp.responseExtensions.length; i++) {
			let typeval = extenmap[ocspBasicResp.responseExtensions[i].extnID];
			if (typeof typeval === "undefined")
				typeval = ocspBasicResp.responseExtensions[i].extnID;

			console.log('test1', typeval);
		}


	}

	for (let i = 0; i < ocspBasicResp.tbsResponseData.responses.length; i++) {
		const serialNumber = bufferToHexCodes(ocspBasicResp.tbsResponseData.responses[i].certID.serialNumber.valueBlock.valueHex);
		var resultOCSP = "";

		switch (ocspBasicResp.tbsResponseData.responses[i].certStatus.idBlock.tagNumber) {
			case 0:
				resultOCSP = "good";
				break;
			case 1:
				resultOCSP = "revoked";
				break;
			case 2:
			default:
				resultOCSP = "unknown";
		}

		console.log(ocspBasicResp.tbsResponseData.responses[i].certStatus.idBlock.tagNumber)

		console.log('Serial Number Certificate:', serialNumber);
		console.log('Certificate Status:', resultOCSP);
		
	}
	console.log('returned',resultOCSP);
	return resultOCSP;
}
