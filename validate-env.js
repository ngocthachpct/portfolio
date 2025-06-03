// Environment Variables Validation Script
const fs = require('fs');
const path = require('path');

function validateEnvironmentVariables() {
  console.log('🔍 Validating Environment Variables...\n');
  console.log('=' .repeat(60));

  // Required environment variables for production
  const requiredVars = {
    // Database
    'DATABASE_URL': {
      description: 'PostgreSQL database connection string',
      required: true,
      sensitive: true
    },
    'DIRECT_URL': {
      description: 'Direct database URL for Prisma migrations',
      required: true,
      sensitive: true
    },
    
    // Admin Authentication
    'ADMIN_USERNAME': {
      description: 'Admin panel username',
      required: true,
      sensitive: false
    },
    'ADMIN_PASSWORD': {
      description: 'Admin panel password',
      required: true,
      sensitive: true
    },

    // Email Service (Optional but recommended)
    'NEXT_PUBLIC_EMAILJS_SERVICE_ID': {
      description: 'EmailJS service ID for contact form',
      required: false,
      sensitive: false
    },
    'NEXT_PUBLIC_EMAILJS_TEMPLATE_ID': {
      description: 'EmailJS template ID',
      required: false,
      sensitive: false
    },
    'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY': {
      description: 'EmailJS public key',
      required: false,
      sensitive: true
    },

    // Environment
    'NODE_ENV': {
      description: 'Environment mode (development/production)',
      required: false,
      sensitive: false
    },

    // Site URL (Auto-set by Vercel)
    'NEXT_PUBLIC_SITE_URL': {
      description: 'Site URL for production',
      required: false,
      sensitive: false
    }
  };

  // Load .env file
  const envPath = path.join(process.cwd(), '.env');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent += fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found .env file');
  } else {
    console.log('❌ .env file not found');
  }

  if (fs.existsSync(envLocalPath)) {
    envContent += '\n' + fs.readFileSync(envLocalPath, 'utf8');
    console.log('✅ Found .env.local file');
  } else {
    console.log('ℹ️  .env.local file not found (optional)');
  }

  // Parse environment variables
  const envVars = {};
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        envVars[key] = value;
      }
    }
  }

  console.log('\n📋 Environment Variables Status:');
  console.log('-'.repeat(60));

  let allRequired = true;
  let warningCount = 0;

  Object.entries(requiredVars).forEach(([varName, config]) => {
    const exists = envVars.hasOwnProperty(varName);
    const hasValue = exists && envVars[varName] && envVars[varName].trim() !== '';
    
    let status = '';
    let icon = '';
    
    if (config.required) {
      if (hasValue) {
        status = 'REQUIRED - SET';
        icon = '✅';
      } else {
        status = 'REQUIRED - MISSING';
        icon = '❌';
        allRequired = false;
      }
    } else {
      if (hasValue) {
        status = 'OPTIONAL - SET';
        icon = '✅';
      } else {
        status = 'OPTIONAL - NOT SET';
        icon = '⚠️ ';
        warningCount++;
      }
    }

    const displayValue = config.sensitive && hasValue 
      ? '***' + envVars[varName].slice(-4)
      : hasValue ? envVars[varName].substring(0, 30) + (envVars[varName].length > 30 ? '...' : '')
      : 'NOT SET';

    console.log(`${icon} ${varName}`);
    console.log(`   Status: ${status}`);
    console.log(`   Value: ${displayValue}`);
    console.log(`   Description: ${config.description}`);
    console.log('');
  });

  console.log('=' .repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('=' .repeat(60));

  if (allRequired) {
    console.log('✅ All required environment variables are set!');
  } else {
    console.log('❌ Some required environment variables are missing!');
  }

  if (warningCount > 0) {
    console.log(`⚠️  ${warningCount} optional variables not set (may affect functionality)`);
  }

  console.log('\n🚀 Production Deployment Checklist:');
  console.log('─'.repeat(40));
  
  const checklist = [
    { item: 'DATABASE_URL set', status: envVars.DATABASE_URL ? '✅' : '❌' },
    { item: 'DIRECT_URL set', status: envVars.DIRECT_URL ? '✅' : '❌' },
    { item: 'ADMIN_USERNAME set', status: envVars.ADMIN_USERNAME ? '✅' : '❌' },
    { item: 'ADMIN_PASSWORD set', status: envVars.ADMIN_PASSWORD ? '✅' : '❌' },
    { item: 'Email service configured', status: envVars.NEXT_PUBLIC_EMAILJS_SERVICE_ID ? '✅' : '⚠️' },
  ];

  checklist.forEach(({ item, status }) => {
    console.log(`${status} ${item}`);
  });

  console.log('\n📝 Next Steps for Vercel Deployment:');
  console.log('1. Set these same variables in Vercel Dashboard:');
  console.log('   → Go to your project → Settings → Environment Variables');
  console.log('2. Make sure to set NODE_ENV="production" in Vercel');
  console.log('3. NEXT_PUBLIC_SITE_URL will be auto-set by Vercel');
  console.log('4. Deploy and test with: node test-production-chatbot.js');

  return allRequired;
}

// Run validation
const isValid = validateEnvironmentVariables();
process.exit(isValid ? 0 : 1);
