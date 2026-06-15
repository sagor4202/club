import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "../i18n/LanguageContext";

const LegalNotice = () => {
  const { t } = useLanguage();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#05051a] text-white font-['Be_Vietnam_Pro'] selection:bg-[#FF00FF]/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-['Epilogue'] text-4xl lg:text-6xl font-extrabold uppercase tracking-tight mb-4">
              {t("legal_notice").split(" ")[0]} <span className="text-[#FF00FF]">{t("legal_notice").split(" ").slice(1).join(" ") || ""}</span>
            </h1>
            <div className="w-20 h-1.5 bg-[#FF00FF] mx-auto rounded-full"></div>
          </div>

          {/* Content Card */}
          <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-10 leading-relaxed text-white/80">
            
            <div className="space-y-6">
              <h2 className="text-white text-2xl font-bold uppercase tracking-widest">Imprint</h2>
              <div className="space-y-1">
                <p className="font-bold text-[#FF00FF]">Provider information</p>
                <p>Mattixx GmbH</p>
                <p>Sterneckstrasse 14</p>
                <p>5020 Salzburg / Austria</p>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">1. Copyright information</h3>
              <p>All information on this website is provided as is, without any guarantee of accuracy, completeness, or timeliness.</p>
              <p>Unless expressly stated otherwise in this publication, specifically in connection with a particular excerpt, file, or document, everyone is authorized to view, copy, print, and distribute this document under the following conditions:</p>
              <p>This document may only be used for non-commercial informational purposes. Every copy of this document or any part thereof must include this copyright notice and the operator's copyright symbol. The document, any copy of the document, or any part thereof may not be modified without the operator's written consent. The operator reserves the right to revoke this permission at any time, and all use must cease immediately upon written notification from the operator.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">2. Contractual assurances and waivers</h3>
              <p>The Pascha Salzburg website is available to you free of charge, unless otherwise agreed. The operators assume no liability for the accuracy of the information contained therein, the availability of the services, the loss of data stored on Pascha Salzburg, or its suitability for any particular purpose.</p>
              <p>The operators are also not liable for consequential damages resulting from the use of the service.</p>
              <p>To the extent that a disclaimer of liability is not applicable, the operators are only liable for gross negligence and intent. Product and company names are trademarks of their respective owners and are used on these pages solely for informational purposes.</p>
              <p>This publication may contain technical or other inaccuracies or typographical errors. Changes are periodically made to the information herein; these changes will be incorporated in new editions of the publication. The operator may make improvements and/or changes to the services described in this publication at any time.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">3. Expression of opinions in comments and in the forum</h3>
              <p>Due to the constantly changing content of comments and forum posts, the operator is unable to review all contributions completely, check their content, and exercise immediate active control over them. No responsibility is assumed for the content, accuracy, or form of the posted contributions.</p>
              <div className="pl-6 border-l-2 border-[#FF00FF]/30 space-y-4">
                <h4 className="text-white font-bold">3a. Special provisions for registered users</h4>
                <p>By registering with »Pascha Salzburg«, the user – hereinafter referred to as »member« – agrees to the following terms of use with the operator:</p>
                <p>Members who participate in discussion forums and comments agree to:</p>
                <p>1. To refrain from any insults, illegal content, pornography, and crude language in your posts,</p>
                <p>2. To bear sole responsibility for the content they post, not to infringe the rights of third parties (in particular trademark, copyright and personal rights) and to fully indemnify the operators of »Pascha Salzburg« against any claims by third parties caused by their contributions.</p>
                <p>3. It is prohibited to post any kind of advertising in forums or comments, or to use forums and comments for any kind of commercial activity. This applies in particular to the publication of "0900" telephone numbers for any purpose.</p>
                <p>There is no entitlement to the publication of submitted comments or forum posts. The operators of "Pascha Salzburg" reserve the right to edit or delete comments and forum posts at their own discretion. In the event of violations of the obligations under points 1), 2), and 3), the operators further reserve the right to temporarily suspend or permanently delete the membership.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">4. Submitting contributions and articles</h3>
              <p>If a member makes use of the opportunity to submit their own contributions for the editorial section of »Pascha Salzburg«, the following applies:</p>
              <p>To post their own contributions, members must have entered their full and correct first and last name in their "Pascha Salzburg" user profile, either before or after submitting the article. The submitted contribution will be publicly attributed to the name entered in the profile upon publication.</p>
              <p>The member makes the following declarations for all contributions that he or she will submit to »Pascha Salzburg« in the future:</p>
              <p>1. The member warrants that the submitted contributions are free from third-party rights, in particular copyrights, trademark rights, or rights of personality. This applies to all submitted contributions and images.</p>
              <p>2. The member grants the operators of »Pascha Salzburg« an unrestricted right of use to the submitted contributions. This includes publication on the internet on »Pascha Salzburg« as well as on other internet servers, in newsletters, print media and other publications.</p>
              <p>3. Submitted contributions will be deleted or anonymized upon request of the member via email to the webmaster's address. Deletion or anonymization will be carried out within 7 days of notification. The operators are only liable for consequential damages incurred by the member due to the delayed deletion of the contribution insofar as they are not based on a breach of duty by the member (as described above in points 1, 2, and 3) and insofar as they are based on gross negligence or intent on the part of the operators of "Pascha Salzburg". In this context, we expressly point out that "Pascha Salzburg" is regularly indexed by search engines and that we have no influence on whether, where, and for how long contributions published on our site may remain stored and accessible in the databases of search engines and web directories even after deletion from "Nightclub Vesuv".</p>
              <p>4. There is no entitlement to the storage, publication, or archiving of submitted contributions. The operators reserve the right not to publish submitted contributions without giving reasons, to edit them before publication, or to delete them again after publication at their sole discretion.</p>
              <p>5. The publication of submitted contributions does not give rise to any claims for remuneration (fees, royalties, reimbursement of expenses, or similar) by the member against "Pascha Salzburg". Participation is voluntary (unpaid).</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">5. Privacy Policy</h3>
              <p>If the option to enter personal or business data is used within this website, the disclosure of this data by the user is expressly voluntary. The use of our service is permitted – insofar as technically possible and reasonable – even without providing such data, or by providing anonymized data or a pseudonym. Further important information on data protection can be found in our Privacy Policy.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">6. Registration and password</h3>
              <p>The user is obligated to keep their username/password combination confidential and not to disclose it to third parties. The operator must be informed immediately if there is any suspicion of misuse of the access data.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-white text-xl font-bold">7. Notice pursuant to the Telemedia Act</h3>
              <p>The respective providers are responsible for third-party websites to which this website links. The operator of this website is not responsible for the content of such third-party websites. Furthermore, this website may be linked to from other websites without our knowledge. The operator assumes no responsibility for the presentation, content, or any connection to this website on third-party websites. The operator is only responsible for external content if they have positive knowledge of it (i.e., including unlawful or criminal content) and if it is technically possible and reasonable to prevent its use. However, according to the German Telemedia Act (TMG), the operator is not obligated to constantly monitor external content.</p>
            </section>

            <div className="space-y-4">
              <p className="font-bold text-white">contact</p>
              <p>Please direct any questions regarding Pascha Salzburg to the webmaster.</p>
              <p className="font-bold text-white">Legal validity</p>
              <p>These General Terms and Conditions of Use apply to Pascha Salzburg.</p>
              <p>Should parts or individual formulations of this text not, no longer, or not fully comply with the applicable legal situation, the remaining parts of the document shall remain unaffected in their content and validity.</p>
            </div>

            <div className="pt-12 text-center border-t border-white/5">
              <Link to="/" className="inline-flex items-center gap-2 text-[#FF00FF] font-bold uppercase tracking-widest hover:text-white transition-colors group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {t("back_to_home")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalNotice;
