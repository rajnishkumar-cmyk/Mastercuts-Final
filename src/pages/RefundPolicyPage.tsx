import {
  PolicyList,
  PolicyNote,
  PolicySection,
  PolicyShell,
  PolicyText,
} from '@/components/policy/PolicyLayout';

const NO_REFUND_CASES = [
  'A change of mind after a service has been completed.',
  'Personal preference where the requested service has been delivered competently.',
  'Failure to follow the recommended aftercare instructions.',
  'Allergic reactions or sensitivities that were not disclosed before treatment.',
  'Results affected by inaccurate or incomplete medical or personal information provided by the client.',
];

const RETURN_CONDITIONS = [
  'They are unopened, unused and in their original packaging.',
  'Proof of purchase is presented.',
];

const LATE_CANCELLATION_OUTCOMES = [
  'Forfeiture of any booking deposit.',
  'A cancellation fee.',
  'A requirement for a deposit or full prepayment for future bookings.',
];

export function RefundPolicyPage() {
  return (
    <PolicyShell
      eyebrow="Refund · Cancellation · Rescheduling"
      title={
        <>
          Refund, Cancellation &amp;{' '}
          <span className="italic">Rescheduling Policy</span>
        </>
      }
      intro={
        <p>
          At Ra by Mastercuts, we are committed to providing every client with
          an exceptional salon, wellness and aesthetic experience. Our services
          involve reserving dedicated appointment times, professional expertise
          and personalised treatments. Accordingly, the following policy
          applies.
        </p>
      }
    >
      {/* 1. Salon & Wellness Services */}
      <PolicySection
        label="Section 01"
        title={
          <>
            Salon &amp; wellness <span className="italic">services</span>
          </>
        }
      >
        <PolicyText>
          All completed salon, wellness and aesthetic services are
          non-refundable.
        </PolicyText>
        <PolicyText>
          If you are dissatisfied with any service, please notify us within{' '}
          <strong>48 hours</strong> of your appointment. We will carefully
          review your concern and where appropriate, may offer a complimentary
          correction, adjustment or another reasonable remedy at our discretion.
        </PolicyText>
        <PolicyText>Refunds will generally not be provided for:</PolicyText>
        <PolicyList items={NO_REFUND_CASES} />
      </PolicySection>

      {/* 2. Retail Products */}
      <PolicySection
        label="Section 02"
        title={
          <>
            Retail <span className="italic">products</span>
          </>
        }
      >
        <PolicyText>
          Retail products may be returned within <strong>7 days</strong> of
          purchase provided that:
        </PolicyText>
        <PolicyList items={RETURN_CONDITIONS} />
        <PolicyNote>
          Opened or used products cannot be returned or refunded unless they are
          confirmed to be defective or otherwise required by applicable consumer
          protection laws.
        </PolicyNote>
      </PolicySection>

      {/* 3. Appointments, Cancellations & No-Shows */}
      <PolicySection
        label="Section 03"
        title={
          <>
            Appointments, cancellations &amp;{' '}
            <span className="italic">no-shows</span>
          </>
        }
      >
        <PolicyText>
          Certain services may require a booking deposit to secure the
          appointment.
        </PolicyText>
        <PolicyText>
          We kindly request at least <strong>24 hours&rsquo; notice</strong> for
          cancellations or rescheduling. Where this is not possible, we
          appreciate a minimum of <strong>4 hours&rsquo; notice</strong>{' '}
          whenever practicable.
        </PolicyText>
        <PolicyText>
          Late cancellations, missed appointments or no-shows may result in:
        </PolicyText>
        <PolicyList items={LATE_CANCELLATION_OUTCOMES} />
        <PolicyNote>
          Clients arriving significantly late may have their treatment shortened
          or rescheduled where necessary to avoid delaying subsequent
          appointments. In such cases, the full service fee may still apply.
        </PolicyNote>
      </PolicySection>

      {/* 4. Ra @Home Services */}
      <PolicySection
        label="Section 04"
        title={
          <>
            Ra @Home <span className="italic">services</span>
          </>
        }
      >
        <PolicyText>
          For home-service appointments, once our therapist or stylist has
          travelled to the client&rsquo;s location, the booking becomes
          non-refundable except where the service cannot be provided due to our
          fault.
        </PolicyText>
        <PolicyText>
          Additional waiting time, parking charges or access fees caused by
          client delay may be charged where applicable.
        </PolicyText>
      </PolicySection>

      {/* 5. Medical Information */}
      <PolicySection
        label="Section 05"
        title={
          <>
            Medical <span className="italic">information</span>
          </>
        }
      >
        <PolicyText>
          Clients are responsible for informing our team before treatment of any
          medical conditions, allergies, pregnancy, injuries, medications or
          other health concerns that may affect the suitability or safety of a
          service.
        </PolicyText>
        <PolicyText>
          Failure to disclose relevant information may result in modification or
          refusal of treatment and will not normally constitute grounds for a
          refund.
        </PolicyText>
      </PolicySection>

      {/* 6. Refund Processing */}
      <PolicySection
        label="Section 06"
        title={
          <>
            Refund <span className="italic">processing</span>
          </>
        }
      >
        <PolicyText>
          Where a refund is approved, it will be processed to the original
          method of payment. Processing times may vary depending on your bank or
          payment provider and generally take{' '}
          <strong>7&ndash;14 business days</strong>.
        </PolicyText>
      </PolicySection>

      {/* 7. Consumer Rights */}
      <PolicySection
        label="Section 07"
        title={
          <>
            Consumer <span className="italic">rights</span>
          </>
        }
        last
      >
        <PolicyText>
          Nothing in this policy limits or excludes any rights available to
          consumers under the applicable laws of the United Arab Emirates.
        </PolicyText>
        <PolicyText>
          If you have any concerns regarding your experience, we encourage you
          to contact us as soon as possible. We are committed to resolving
          concerns fairly, professionally and promptly.
        </PolicyText>
      </PolicySection>
    </PolicyShell>
  );
}
