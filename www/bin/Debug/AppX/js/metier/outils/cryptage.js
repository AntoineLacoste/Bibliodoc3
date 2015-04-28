function Sha1(chaine) {
	/// <summary>
	/// Crypte une chaine en SHA1
	/// </summary>
	/// <param name="chaine">chaine à crypter</param>

    // SHA1
    var crypt = Windows.Security.Cryptography;
    var provider = crypt.Core.HashAlgorithmProvider.openAlgorithm('SHA1');
    // Mot de passe saisi par l'utilisateur crypté en SHA1
    var hashPwd = provider.hashData(crypt.CryptographicBuffer.convertStringToBinary(chaine, crypt.BinaryStringEncoding.utf8));
    if (hashPwd.length !== provider.hashLength) {
        throw new WinJS.ErrorFromName('InvalidArgumentException', "Generated hash length is different that algorithm hash length");
    }
    var sha1Pwd = crypt.CryptographicBuffer.encodeToHexString(hashPwd);

    return sha1Pwd;
}