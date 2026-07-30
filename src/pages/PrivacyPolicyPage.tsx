import {
  PolicyBlock,
  PolicyList,
  PolicyNote,
  PolicySection,
  PolicyShell,
  PolicyText,
} from '@/components/policy/PolicyLayout';

const INFORMATION_WE_COLLECT = [
  'Full name',
  'Mobile number',
  'Email address',
  'Date of birth (where relevant)',
  'Gender (where relevant)',
  'Residential address (if home services are booked)',
  'Appointment information and booking details',
  'Appointment history',
  'Services received',
  'Preferred therapist or stylist',
  'Consultation records',
  'Notes relating to previous treatments',
  'Health Information',
];

const HEALTH_INFORMATION = [
  'Allergies',
  'Medical conditions',
  'Current medications',
  'Pregnancy status',
  'Skin sensitivities;',
  'Other information relevant to treatment suitability',
];

const IMAGE_USES = [
  'for treatment records',
  'monitor treatment progress',
  'for educational purposes',
  'for marketing and promotional use',
];

const WEBSITE_INFORMATION = [
  'IP address',
  'Browser type',
  'Device Information',
  'Operating System',
  'Pages Visited',
  'Time Spent on our website',
  'Cookies and similar technologies',
];

const HOW_WE_USE = [
  'Schedule, manage and confirm appointments',
  'Deliver salon, wellness and aesthetic treatments safely',
  'Maintain treatment records',
  'Respond to enquiries and customer service requests',
  'Process payments',
  'Issue invoices and receipts',
  'Improve our services',
  'Personalise client experience',
  'Comply with legal and regulatory obligations',
  'Prevent fraud and protect our business',
  'Send appointment reminders',
  'Send promotional offers where you have consented or were permitted by applicable law',
];

const MARKETING_GROUNDS = [
  'you have provided your consent',
  'you have requested information from us; or',
  'we are otherwise permitted to do so under applicable law',
];

const MARKETING_OPT_OUT = [
  'clicking the unsubscribe link;',
  'replying “STOP” where applicable; or',
  'contacting us directly',
];

const LEGAL_BASIS = [
  'your consent;',
  'performance of a contract with you;',
  'compliance with legal obligations;',
  'protection of your vital interest;',
  'our legitimate business interests, provided these do not override your rights and freedoms',
];

const SHARING = [
  'secure payment providers;',
  'appointment booking platforms;',
  'business management software providers;',
  'IT support providers;',
  'website hosting providers;',
  'auditors or professional advisers;',
  'insurer where necessary;',
  'regulatory authorities, law enforcement agencies or government bodies where required by law;',
];

const RETENTION = [
  'provide our services;',
  'maintain treatment records;',
  'comply with legal obligations;',
  'resolve disputes;',
  'enforce our agreements;',
];

const SECURITY = [
  'unauthorised access;',
  'accidental loss;',
  'misuse;',
  'disclosure;',
  'alteration; and',
  'destruction',
];

const COOKIE_USES = [
  'improve website performance;',
  'remember your preferences;',
  'analyse website traffic;',
  'enhance user experience',
];

const YOUR_RIGHTS = [
  'access your personal information;',
  'receive a copy of certain personal information;',
  'correct inaccurate or incomplete information;',
  'update your contact details;',
  'request deletion of personal information where legally permissible;',
  'restrict certain processing activities;',
  'object to certain processing;',
  'withdraw consent where processing is based on consent;',
  'opt out of marketing communications at any time',
];

export function PrivacyPolicyPage() {
  return (
    <PolicyShell
      eyebrow="Effective Date: July 1, 2026"
      title={
        <>
          Privacy <span className="italic">Policy</span>
        </>
      }
      intro={
        <>
          <p className="text-sm uppercase tracking-[0.16em] text-text-secondary">
            Privacy Policy of Ra by Mastercuts
          </p>
          <p>
            <strong className="text-text-primary font-normal">
              Ra by Mastercuts
            </strong>{' '}
            (“Ra”, “we”, “our” or “us”) respects your privacy and is committed
            to protecting your personal information. We believe that trust is
            fundamental to every client relationship and we are committed to
            handling your information responsibly securely and transparently.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, disclose, store,
            and protect your information when you visit our website, contact us
            by phone, email, Whatsapp or social media, book appointments online,
            or in person, purchase products or gift vouchers, receive salon,
            wellness aesthetic or home services from us.
          </p>
          <p>
            By using our services, you acknowledge that your personal
            information will be handled in accordance with this Privacy Policy.
          </p>
        </>
      }
    >
      {/* Information We Collect */}
      <PolicySection
        label="Section 01"
        title={
          <>
            Information we <span className="italic">collect</span>
          </>
        }
      >
        <PolicyText>
          Depending on the services you request, we may collect:
        </PolicyText>
        <PolicyList items={INFORMATION_WE_COLLECT} />

        <PolicyBlock title="Health Information">
          <PolicyText>
            For certain beauty, wellness and aesthetic treatments, we may ask
            you to voluntarily provide information relevant to your safety,
            including:
          </PolicyText>
          <PolicyList items={HEALTH_INFORMATION} />
          <PolicyNote>
            You are under no obligation to provide medical information; however,
            failure to provide relevant information may affect our ability to
            safely perform certain treatments.
          </PolicyNote>
        </PolicyBlock>

        <PolicyBlock title="Payment Information">
          <PolicyText>
            Payments are processed through secure third-party payment providers.
          </PolicyText>
          <PolicyText>
            We do not store complete credit and debit card details on our
            systems.
          </PolicyText>
        </PolicyBlock>

        <PolicyBlock title="Images and Videos">
          <PolicyText>
            With your prior consent, we may take photographs or videos:
          </PolicyText>
          <PolicyList items={IMAGE_USES} />
          <PolicyNote>
            You may refuse or withdraw consent of marketing use of photographs
            at any time. Your decision will not affect the services you receive.
          </PolicyNote>
        </PolicyBlock>
      </PolicySection>

      {/* Website Information */}
      <PolicySection
        label="Section 02"
        title={
          <>
            Website <span className="italic">information</span>
          </>
        }
      >
        <PolicyText>
          When you visit our website, we may automatically collect:
        </PolicyText>
        <PolicyList items={WEBSITE_INFORMATION} />
      </PolicySection>

      {/* How We Use Your Information */}
      <PolicySection
        label="Section 03"
        title={
          <>
            How we use your <span className="italic">information</span>
          </>
        }
      >
        <PolicyText>
          We use your information only where reasonably necessary for legitimate
          business purposes, including to:
        </PolicyText>
        <PolicyList items={HOW_WE_USE} />
      </PolicySection>

      {/* Marketing Communications */}
      <PolicySection
        label="Section 04"
        title={
          <>
            Marketing <span className="italic">communications</span>
          </>
        }
      >
        <PolicyText>
          We will only send promotional communications where:
        </PolicyText>
        <PolicyList items={MARKETING_GROUNDS} />
        <PolicyBlock title="Opting out">
          <PolicyText>
            You may opt out of marketing communications at any time by:
          </PolicyText>
          <PolicyList items={MARKETING_OPT_OUT} />
        </PolicyBlock>
        <PolicyNote>
          Opting out of marketing messages will not affect appointment
          confirmations or other essential service communications.
        </PolicyNote>
      </PolicySection>

      {/* Legal Basis of Processing */}
      <PolicySection
        label="Section 05"
        title={
          <>
            Legal basis of <span className="italic">processing</span>
          </>
        }
      >
        <PolicyText>
          Where required by applicable law, we process personal information on
          one or more following grounds:
        </PolicyText>
        <PolicyList items={LEGAL_BASIS} />
      </PolicySection>

      {/* Sharing Your Information */}
      <PolicySection
        label="Section 06"
        title={
          <>
            Sharing your <span className="italic">information</span>
          </>
        }
      >
        <PolicyText>
          We do not sell, rent or trade your personal information.
        </PolicyText>
        <PolicyText>
          We may share information only where necessary with:
        </PolicyText>
        <PolicyList items={SHARING} />
        <PolicyNote>
          All third-party providers are expected to maintain appropriate
          confidentiality and security measures.
        </PolicyNote>
      </PolicySection>

      {/* International Transfers */}
      <PolicySection
        label="Section 07"
        title={
          <>
            International <span className="italic">transfers</span>
          </>
        }
      >
        <PolicyText>
          Some of our technology providers may process information outside the
          United Arab Emirates.
        </PolicyText>
        <PolicyText>
          Where this occurs, we take reasonable steps to ensure that appropriate
          safeguards are in place to protect your personal information in
          accordance with applicable laws.
        </PolicyText>
      </PolicySection>

      {/* Data Retention */}
      <PolicySection
        label="Section 08"
        title={
          <>
            Data <span className="italic">retention</span>
          </>
        }
      >
        <PolicyText>
          We retain your personal information only for as long as reasonably
          necessary to:
        </PolicyText>
        <PolicyList items={RETENTION} />
        <PolicyNote>
          When information is no longer required, it will be securely deleted,
          anonymised or destroyed.
        </PolicyNote>
      </PolicySection>

      {/* Data Security */}
      <PolicySection
        label="Section 09"
        title={
          <>
            Data <span className="italic">security</span>
          </>
        }
      >
        <PolicyText>
          We implement appropriate administrative, organisational, physical and
          technical safeguards designed to protect your personal information
          against:
        </PolicyText>
        <PolicyList items={SECURITY} />
        <PolicyNote>
          Although we employ commercially reasonable security measures, no
          electronic transmission or storage system can be guaranteed to be
          completely secure.
        </PolicyNote>
      </PolicySection>

      {/* Cookies */}
      <PolicySection label="Section 10" title={<span className="italic">Cookies</span>}>
        <PolicyText>
          Our website may use cookies and similar technologies to:
        </PolicyText>
        <PolicyList items={COOKIE_USES} />
        <PolicyNote>
          You may disable cookies through your browser settings; however,
          certain website functions may not operate correctly.
        </PolicyNote>
      </PolicySection>

      {/* Your Rights */}
      <PolicySection
        label="Section 11"
        title={
          <>
            Your <span className="italic">rights</span>
          </>
        }
      >
        <PolicyText>Subject to applicable law, you may request to:</PolicyText>
        <PolicyList items={YOUR_RIGHTS} />
        <PolicyNote>
          We may require verification of your identity before processing your
          request.
        </PolicyNote>
      </PolicySection>

      {/* Children's Privacy */}
      <PolicySection
        label="Section 12"
        title={
          <>
            Children&rsquo;s <span className="italic">privacy</span>
          </>
        }
      >
        <PolicyText>
          Our services are not directed toward children without the involvement
          of a parent or legal guardian.
        </PolicyText>
        <PolicyText>
          Where treatment is provided to a minor, consent may be required from a
          parent or legal guardian in accordance with applicable laws and
          professional practice.
        </PolicyText>
      </PolicySection>

      {/* Third-Party Websites */}
      <PolicySection
        label="Section 13"
        title={
          <>
            Third-party <span className="italic">websites</span>
          </>
        }
      >
        <PolicyText>
          Our website or social media pages may contain links to third-party
          websites.
        </PolicyText>
        <PolicyText>
          We are not responsible for the privacy practices, security or content
          of those external websites and encourage you to review their privacy
          policies separately.
        </PolicyText>
      </PolicySection>

      {/* Changes to this Privacy Policy */}
      <PolicySection
        label="Section 14"
        title={
          <>
            Changes to this <span className="italic">Privacy Policy</span>
          </>
        }
      >
        <PolicyText>
          We may update this Privacy Policy from time to time to reflect changes
          in our business practices, technology or legal requirements.
        </PolicyText>
        <PolicyText>
          The updated version will be published on our website together with the
          revised Effective Date.
        </PolicyText>
      </PolicySection>

      {/* Contact Us */}
      <PolicySection
        label="Section 15"
        title={
          <>
            Contact <span className="italic">us</span>
          </>
        }
        last
      >
        <PolicyText>
          If you have any questions regarding this Privacy Policy or wish to
          exercise your privacy rights, please contact Ra by Mastercuts using
          the contact details provided on our official website.
        </PolicyText>
        <PolicyText>
          We will endeavour to respond within a reasonable time and in
          accordance with applicable law.
        </PolicyText>
      </PolicySection>
    </PolicyShell>
  );
}
