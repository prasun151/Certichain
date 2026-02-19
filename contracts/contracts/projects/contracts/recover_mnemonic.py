from algosdk import mnemonic, wordlist

def recover_25th_word(phrase_24):
    word_list = wordlist.word_list_raw().split(",")
    valid_phrases = []
    
    for word in word_list:
        phrase_25 = f"{phrase_24} {word.strip()}"
        try:
            mnemonic.to_private_key(phrase_25)
            valid_phrases.append(phrase_25)
        except Exception:
            pass
            
    return valid_phrases

phrase_24 = "rack group letter catalog news example romance ring seven girl dynamic someone advice midnight blind twice chef rigid sheriff pen episode such pool wasp"
results = recover_25th_word(phrase_24)

if results:
    print(f"Found {len(results)} valid phrase(s):")
    for r in results:
        print(r)
else:
    print("No valid 25th word found. Check the 24 words.")
