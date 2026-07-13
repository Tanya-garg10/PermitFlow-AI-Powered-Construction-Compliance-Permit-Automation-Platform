import test from 'node:test';
import assert from 'node:assert/strict';
import { getChatUiCopy, getChatLanguageHint, getSpeechLanguageCode } from '../src/chatLocalization';
import { translateText } from '../src/i18n';

test('returns Hindi assistant copy for Hindi selection', () => {
  const copy = getChatUiCopy('Hindi');

  assert.equal(copy.initialMessage.includes('सरवम'), true);
  assert.equal(copy.suggestions[0], 'क्या मुझे Fire NOC चाहिए?');
  assert.equal(copy.loadingText, 'एआई अनुपालन सहायक प्रसंस्करण कर रहा है...');
});

test('returns Gujarati speech language code for Gujarati selection', () => {
  assert.equal(getSpeechLanguageCode('Gujarati'), 'gu-IN');
  assert.equal(getChatLanguageHint('Gujarati'), 'જવાબ મૂળભૂત અને વ્યવસાયિક ગુજરાતી ભાષામાં આપો.');
});

test('returns translated auth copy for Hindi selection', () => {
  assert.equal(translateText('Corporate Email Address', 'Hindi'), 'कॉर्पोरेट ईमेल पता');
  assert.equal(translateText('Send OTP Verification', 'Hindi'), 'OTP सत्यापन भेजें');
});

test('returns chat copy and speech code for Marathi and Punjabi selections', () => {
  const marathiCopy = getChatUiCopy('Marathi');
  const punjabiCopy = getChatUiCopy('Punjabi');

  assert.equal(marathiCopy.assistantTitle.includes('AI'), true);
  assert.equal(punjabiCopy.speakLabel, 'ਬੋਲੋ');
  assert.equal(getSpeechLanguageCode('Marathi'), 'mr-IN');
  assert.equal(getSpeechLanguageCode('Punjabi'), 'pa-IN');
});

test('returns speech and hint mappings for Bengali, Odia, and Assamese selections', () => {
  assert.equal(getSpeechLanguageCode('Bengali'), 'bn-IN');
  assert.equal(getSpeechLanguageCode('Odia'), 'or-IN');
  assert.equal(getSpeechLanguageCode('Assamese'), 'as-IN');
  assert.equal(getChatLanguageHint('Bengali').includes('বাংলা'), true);
  assert.equal(getChatLanguageHint('Odia').includes('ଓଡ଼ିଆ'), true);
  assert.equal(getChatLanguageHint('Assamese').includes('অসমীয়া'), true);
});

test('returns translated website copy for Marathi, Punjabi, Kannada, Malayalam, and Telugu selections', () => {
  assert.equal(translateText('PermitFlow', 'Marathi'), 'परमिटफ्लो');
  assert.equal(translateText('Portal Login', 'Punjabi'), 'ਪੋਰਟਲ ਲਾਗਇਨ');
  assert.equal(translateText('System Alerts', 'Kannada'), 'ಸಿಸ್ಟಮ್ ಅಲರ್ಟ್ಸ್');
  assert.equal(translateText('System Alerts', 'Malayalam'), 'സിസ്റ്റം അലേർട്ട്സ്');
  assert.equal(translateText('System Alerts', 'Telugu'), 'సిస్టమ్ అలెర్ట్స్');
});

test('translates the remaining compliance and officer view copy for the added languages', () => {
  assert.equal(translateText('AI Approval Probability', 'Marathi'), 'AI स्वीकृती संभाव्यता');
  assert.equal(translateText('Municipal Officer Review Notes', 'Punjabi'), 'ਮਿਊਨਿਸਿਪਲ ਆਫਿਸਰ ਰੀਵਿਊ ਨੋਟਸ');
  assert.equal(translateText('AI-Generated Checklist', 'Kannada'), 'AI-ಜನರಿತ ಚೆಕ್‌ಲಿಸ್ಟ್');
  assert.equal(translateText('Municipal Officer Review Notes', 'Malayalam'), 'മ്യൂണിസിപ്പൽ ഓഫിസർ റിവ്യൂ നോട്ടുകൾ');
  assert.equal(translateText('Municipal Officer Review Notes', 'Telugu'), 'మునిసిపల్ ఆఫీసర్ రివ్యూ నోట్లు');
});
